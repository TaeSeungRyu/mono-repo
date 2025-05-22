import { CommonUseCase } from 'src/common/common.usecase';
import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { JWTCode } from '../../domain/jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';
import { SseService } from 'src/modules/sse/application/service/sse.service';

@Injectable()
export class LogOutUseCase
  implements CommonUseCase<{ username: string; res: Response }>
{
  constructor(
    private redisService: RedisService,
    private sseService: SseService,
  ) {}

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
    console.log('req.user', username);
    if (username) {
      await this.redisService.del(username);
      await this.redisService.del(`${username}_info`);
      const aaa = await this.redisService.get(username);
      const bbb = await this.redisService.get(`${username}_info`);
      console.log('aaa', aaa);
      console.log('bbb', bbb);
      this.sseService.logOutClient(username);
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
