import { Injectable } from '@nestjs/common';
import { CreateBoardUseCase } from '../use-cases/create-board.use-case';
import { UpdateBoardUseCase } from '../use-cases/update-board.use-case';
import { DeleteBoardUseCase } from '../use-cases/delete-board.use-case';
import { FindAllBoardUseCase } from '../use-cases/find-all-board.use-case';
import { FindOneBoardUseCase } from '../use-cases/find-one-board.use-case';
import { Board } from '../../domain/board.entity';
import { Request } from 'express';

@Injectable()
export class BoardService {
  constructor(
    private readonly createUseCase: CreateBoardUseCase,
    private readonly updateUseCase: UpdateBoardUseCase,
    private readonly deleteUseCase: DeleteBoardUseCase,
    private readonly findAllUseCase: FindAllBoardUseCase,
    private readonly findOneUseCase: FindOneBoardUseCase,
  ) {}

  async findAll() {
    return this.findAllUseCase.execute();
  }
  async findOne(id: string) {
    return this.findOneUseCase.execute(id);
  }

  async create(req: Request, board: Board) {
    return this.createUseCase.execute({ req, board });
  }
  async update(id: string, board: Board) {
    return this.updateUseCase.execute({ id, board });
  }
  async delete(id: string) {
    return this.deleteUseCase.execute(id);
  }
}
