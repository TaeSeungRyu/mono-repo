// jwt-auth.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServerOptions } from 'socket.io';
import { Server } from 'socket.io';
import { JwtPayload } from 'src/modules/auth/domain/jwt-payload.interface';
import { AuthenticatedSocket } from './socket-with-user.interface';

@Injectable()
export class JwtAuthAdapter extends IoAdapter {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, options) as Server;

    server.use((socket: AuthenticatedSocket, next) => {
      const authHeader = socket.handshake.headers.authorization;
      if (!authHeader) return next(new Error('No token'));
      const token = authHeader.replace('Bearer ', '');
      try {
        const payload: JwtPayload = this.jwtService.verify(token);
        socket.user = payload; // 사용자를 소켓에 저장
        next();
      } catch (err) {
        let message = 'Unknown Error';
        if (err instanceof Error) message = err.message;
        next(new Error(message));
      }
    });

    return server;
  }
}
