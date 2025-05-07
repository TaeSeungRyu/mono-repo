import { RedisModule } from '@nestjs-modules/ioredis';
import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisProviderModule {}
