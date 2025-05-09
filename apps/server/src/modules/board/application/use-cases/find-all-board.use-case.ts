import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Board } from '../../domain/board.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllBoardUseCase implements CommonUseCase {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async execute(): Promise<ResponseDto> {
    const data = await this.boardRepo.find();
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
