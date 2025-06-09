import { Injectable, Logger } from '@nestjs/common';
import { TodoUseCase } from '../use-cases/todo.use-case';
import { ResponseDto } from 'src/common/common.dto';
import { ScrappingDto } from '../../domain/scrapping.dto';
import { FindScrappingWithPagingUseCase } from '../use-cases/find.use-case';

@Injectable()
export class ScrappingRunnerService {
  private readonly logger = new Logger(ScrappingRunnerService.name);
  constructor(
    private todoUseCase: TodoUseCase,
    private findScrappingWithPagingUseCase: FindScrappingWithPagingUseCase,
  ) {}

  excute(): void {
    this.todoUseCase.excute().catch((error) => {
      this.logger.error('Error during scrapping execution:', error);
    });
  }

  async find(req: ScrappingDto): Promise<ResponseDto> {
    return this.findScrappingWithPagingUseCase.execute(req);
  }
}
