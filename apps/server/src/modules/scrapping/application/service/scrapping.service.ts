import { Injectable } from '@nestjs/common';
import { TodoUseCase } from '../use-cases/todo.use-case';
import { ResponseDto } from 'src/common/common.dto';
import { ScrappingDto } from '../../domain/scrapping.dto';
import { FindScrappingWithPagingUseCase } from '../use-cases/find.use-case';

@Injectable()
export class ScrappingRunnerService {
  constructor(
    private todoUseCase: TodoUseCase,
    private findScrappingWithPagingUseCase: FindScrappingWithPagingUseCase,
  ) {}

  excute(): void {
    this.todoUseCase.excute().catch((error) => {
      console.error('Error during scrapping execution:', error);
    });
  }

  async find(req: ScrappingDto): Promise<ResponseDto> {
    return this.findScrappingWithPagingUseCase.execute(req);
  }
}
