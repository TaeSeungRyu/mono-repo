import { Module } from '@nestjs/common';
import { ChatGateway } from './infrastructure/chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { HandleCoannectionUseCase } from './application/handle-connection.use-case';
import { HandleDisCoannectionUseCase } from './application/handle-disconnection.use-case';
import { HandleMessageUseCase } from './application/handle-message.use-case';

@Module({
  imports: [AuthModule],
  providers: [
    HandleCoannectionUseCase,
    HandleDisCoannectionUseCase,
    HandleMessageUseCase,
    ChatGateway,
  ],
  controllers: [],
  exports: [],
})
export class ChattingModule {}
