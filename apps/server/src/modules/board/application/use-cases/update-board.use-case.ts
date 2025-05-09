import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Board } from '../../domain/board.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateBoardUseCase
  implements CommonUseCase<{ id: string; board: Board }>
{
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async execute({
    id,
    board,
  }: {
    id: string;
    board: Board;
  }): Promise<ResponseDto> {
    const data = await this.boardRepo.update(id, board);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '수정 성공',
    );
  }
}
