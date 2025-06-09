// types/socket-with-user.interface.ts
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/modules/auth/domain/jwt-payload.interface';

export interface AuthenticatedSocket extends Socket {
  user: JwtPayload;
}
