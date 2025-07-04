// src/types/express.d.ts
import { Auth } from 'src/modules/user/domain/auth.entity.js';
import { JwtPayload } from '../auth/jwt-payload.interface.ts'; // 직접 정의한 인터페이스

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string; // 사용자 ID
      username: string; // 사용자 이름
      email: string; // 사용자 이메일
      iat: number; // 발급 시간
      exp: number; // 만료 시간
      roles?: Auth[]; // 사용자 역할
    }

    interface Request {
      user: User;
    }
  }
}
