import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SseUseCaseType } from '../../domain/sse.dto';

@Injectable()
export class IsSigninUserUseCase {
  constructor(private redisService: RedisService) {}

  async execute(id: string): Promise<SseUseCaseType> {
    const isUserSignin = await this.redisService.get(id);
    if (!isUserSignin) {
      return {
        result: false,
        data: {},
      };
    }
    return {
      result: true,
      data: {
        id: id,
        isSignin: isUserSignin,
      },
    };
  }
}
