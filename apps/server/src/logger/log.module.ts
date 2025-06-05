//모듈 추가하기
import { Module } from '@nestjs/common';
import { LoggerRunner } from './logger.runner';

@Module({
  imports: [],
  providers: [LoggerRunner],
  controllers: [],
  exports: [LoggerRunner],
})
export class LogModule {}
