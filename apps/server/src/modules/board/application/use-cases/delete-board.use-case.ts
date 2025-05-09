import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Board } from '../../domain/board.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteBoardUseCase implements CommonUseCase<string> {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async execute(id: string): Promise<ResponseDto> {
    const data = await this.boardRepo.delete(id);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '삭제 성공',
    );
  }
}
