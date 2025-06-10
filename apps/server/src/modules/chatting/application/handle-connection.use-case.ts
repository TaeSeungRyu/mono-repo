import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '../domain/socket-with-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/auth/domain/jwt-payload.interface';

@Injectable()
export class HandleCoannectionUseCase {
  constructor(private readonly jwtService: JwtService) {}

  private getParam(url: string, key: string) {
    if (!url) return '';
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    return urlParams.get(key) || '';
  }

  async execute(socket: AuthenticatedSocket): Promise<any> {
    const url = socket?.client?.request?.url || '';
    const token = this.getParam(url, 'Authorization'); // 토큰 파라미터 추출 (예시로 사용)
    if (!token) {
      socket.disconnect(); // 유효하지 않은 토큰이면 연결 종료
      return new Promise((_, reject) => {
        reject(new Error('유효하지 않은 토큰'));
      });
    }

    const payload: JwtPayload = this.jwtService.verify(token);
    if (!payload) {
      socket.disconnect(); // 유효하지 않은 토큰이면 연결 종료
      return new Promise((_, reject) => {
        reject(new Error('유효하지 않은 토큰'));
      });
    }
    socket.user = payload; // 소켓에 사용자 정보 추가
    return new Promise((resolve) => {
      resolve({
        message: `${socket.id} connected`,
        user: payload,
      });
    });
  }
}
