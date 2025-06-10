import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../domain/socket-with-user.interface';

@Injectable()
export class HandleDisCoannectionUseCase {
  constructor() {}

  async execute(socket: AuthenticatedSocket): Promise<any> {
    console.log(
      `클라이언트 연결 종료됨: ${socket.id} ${JSON.stringify(socket?.user)}`,
    );
    return new Promise((resolve) => {
      resolve({
        message: `${socket.id} disconnected`,
        user: socket.user,
      });
    });
  }
}
