import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Scrapping } from './domain/scrapping.entity';
import { ScrappingRunnerService } from './application/service/scrapping.service';
import { TodoUseCase } from './application/use-cases/todo.use-case';
import { ScrappingRunner } from './infrastructure/scrapping.runner';
import { FindScrappingWithPagingUseCase } from './application/use-cases/find.use-case';
import { ScrappingController } from './infrastructure/scrapping.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapping])],
  providers: [
    ScrappingRunner,
    ScrappingRunnerService,
    TodoUseCase,
    FindScrappingWithPagingUseCase,
  ],
  controllers: [ScrappingController],
  exports: [],
})
export class ScrappingModule {}
