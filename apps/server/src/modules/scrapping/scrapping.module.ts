import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Scrapping } from './domain/scrapping.entity';
import { ScrappingRunnerService } from './application/service/scrapping.service';
import { TodoUseCase } from './application/use-cases/todo.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Scrapping])],
  providers: [ScrappingRunnerService, TodoUseCase],
  controllers: [],
  exports: [],
})
export class ScrappingModule {}
