import { Module } from '@nestjs/common';

import { SseController } from './infrastructure/sse.controller';
import { SseService } from './application/service/sse.service';

@Module({
  imports: [],
  providers: [SseService],
  controllers: [SseController],
  exports: [],
})
export class SseModule {}
