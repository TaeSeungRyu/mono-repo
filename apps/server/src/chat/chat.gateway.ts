// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socket-with-user.interface';

@WebSocketGateway(8081, {
  cors: {
    origin: '*', // 개발 중엔 허용
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private wsClients: Array<AuthenticatedSocket> = [];

  constructor() {
    console.log('ChatGateway initialized');
  }

  handleConnection(client: AuthenticatedSocket) {
    console.log(`클라이언트 연결됨: ${client.id} ${client?.user?.username}`);
    this.wsClients.push(client);
    this.server.emit('message', `${client.id} connected`); // 모든 클라이언트에게 메시지 브로드캐스트
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`클라이언트 연결 종료됨: ${client.id}`);
    this.server.emit('message', `${client.id} disconnected`); // 모든 클라이언트에게 연결 종료 메시지 브로드캐스트
    this.wsClients = this.wsClients.filter((c) => c.id !== client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    console.log('받은 메시지:', data);
    this.wsClients.forEach((client) => {
      client.emit('message', data);
    });
  }
}
