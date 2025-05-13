import { CommonUseCase } from 'src/common/common.usecase';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JWTCode, JwtPayload } from '../../domain/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenUseCase implements CommonUseCase<Request> {
  constructor(private jwtService: JwtService) {}

  async execute(req: Request): Promise<ResponseDto> {
    console.log(req.cookies[JWTCode.refreshToken]);
    if (!req.cookies[JWTCode.refreshToken]) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            'invalid_user',
            '사용자 정보가 없습니다.',
          ),
        );
      });
    }
    const refreshToken = req.cookies[JWTCode.refreshToken] as string;
    try {
      const payload: JwtPayload = this.jwtService.decode(refreshToken);
      const accessToken = this.jwtService.sign({ username: payload.username });
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
              success: true,
            },
            '',
            'Refresh token successful',
          ),
        );
      });
    } catch (error: any) {
      console.log(error);
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            `${error}`,
            'Refresh token이 유효하지 않습니다.',
          ),
        );
      });
    }
  }
}
