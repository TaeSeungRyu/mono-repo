import { Injectable } from '@nestjs/common';
import { TodoUseCase } from '../use-cases/todo.use-case';

@Injectable()
export class ScrappingRunnerService {
  constructor(private todoUseCase: TodoUseCase) {}

  excute() {
    this.todoUseCase.excute();
  }
}
