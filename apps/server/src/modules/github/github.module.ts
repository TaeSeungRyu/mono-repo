import { Module } from '@nestjs/common';
import { GithubService } from './application/services/github.service';
import { HttpModule } from '@nestjs/axios';
import { GithubController } from './infrastructure/github.controller';
import { FindGihubUseCase } from './application/use-cases/find-github.use-case';

@Module({
  imports: [HttpModule],
  providers: [FindGihubUseCase, GithubService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubModule {}
