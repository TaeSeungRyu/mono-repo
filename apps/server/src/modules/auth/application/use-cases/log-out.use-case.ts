import { CommonUseCase } from 'src/common/common.usecase';
import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { JWTCode } from '../../domain/jwt-payload.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LogOutUseCase
  implements CommonUseCase<{ req: Request; res: Response }>
{
  constructor(private redisService: RedisService) {}

  async execute({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<ResponseDto> {
    res.clearCookie(JWTCode.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    if (req.user) {
      await this.redisService.del(req.user?.username);
      await this.redisService.del(`${req.user?.username}_info`);
    }
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            success: true,
          },
          '',
          'Logout successful',
        ),
      );
    });
  }
}
