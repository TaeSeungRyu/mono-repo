import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class HandleMessageUseCase {
  constructor() {}

  //나중에 여기에서 각종 조건에 따른 메시지 처리 로직을 추가할 수 있습니다.
  execute(wsClients: Array<Socket>, data: any): void {
    wsClients.forEach((client) => {
      client.emit('message', data);
    });
  }
}
