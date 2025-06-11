// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthenticatedSocket } from '../domain/socket-with-user.interface';
import { HandleCoannectionUseCase } from '../application/handle-connection.use-case';
import { HandleDisCoannectionUseCase } from '../application/handle-disconnection.use-case';
import { HandleMessageUseCase } from '../application/handle-message.use-case';

@WebSocketGateway(8081, {
  cors: {
    origin: '*', // 개발 중엔 허용
  },
  //namespace: 'websocket', // 네임스페이스 설정
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private wsClients: Array<Socket> = [];

  constructor(
    private readonly handleConnectionUseCase: HandleCoannectionUseCase,
    private readonly handleDisconnectionUseCase: HandleDisCoannectionUseCase, // 연결 종료 핸들러
    private readonly handleMessageUseCase: HandleMessageUseCase, // 메시지 핸들러
  ) {}

  handleConnection(socket: AuthenticatedSocket) {
    this.handleConnectionUseCase
      .execute(socket)
      .then(() => {
        this.wsClients.push(socket);
        this.server.emit('message', `${socket.id} connected`); // 모든 클라이언트에게 메시지 브로드캐스트
      })
      .catch(() => {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.handleDisconnectionUseCase
      .execute(socket)
      .then(() => {
        this.server.emit('message', `${socket.id} disconnected`); // 모든 클라이언트에게 연결 종료 메시지 브로드캐스트
        this.wsClients = this.wsClients.filter((c) => c.id !== socket.id);
      })
      .catch(() => {});
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    this.handleMessageUseCase.execute(this.wsClients, data);
  }
}
