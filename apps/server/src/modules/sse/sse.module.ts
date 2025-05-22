import { Module } from '@nestjs/common';

import { SseController } from './infrastructure/sse.controller';
import { SseService } from './application/service/sse.service';
import { RedisProviderModule } from 'src/redis/redis.module';
import { IsSigninUserUseCase } from './application/use-cases/is-signin-user.use-case';
import { AddClientUseCase } from './application/use-cases/add-client.use-case';

@Module({
  imports: [RedisProviderModule],
  providers: [SseService, IsSigninUserUseCase, AddClientUseCase],
  controllers: [SseController],
  exports: [SseService],
})
export class SseModule {}
