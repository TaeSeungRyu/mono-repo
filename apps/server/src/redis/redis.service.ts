import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(
    key: string,
    value: string,
    expirationInSeconds?: number,
  ): Promise<void> {
    if (expirationInSeconds) {
      await this.redis.set(key, value, 'EX', expirationInSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }
  async exists(key: string): Promise<number> {
    return await this.redis.exists(key);
  }
}
