import { CommonUseCase } from 'src/common/common.usecase';
import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { JWTCode } from '../../domain/jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LogOutUseCase
  implements CommonUseCase<{ username: string; res: Response }>
{
  constructor(private redisService: RedisService) {}

  async execute({
    username,
    res,
  }: {
    username: string;
    res: Response;
  }): Promise<ResponseDto> {
    if (res.clearCookie) {
      res.clearCookie(JWTCode.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
    if (username) {
      await this.redisService.del(username);
      await this.redisService.del(`${username}_info`);
    }
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            success: true,
            data: {},
          },
          '',
          'Logout successful',
        ),
      );
    });
  }
}
