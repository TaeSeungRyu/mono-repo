import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';
import { ResponseDto } from 'src/common/common.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private board: Repository<Board>,
  ) {}

  async findAll() {
    const data = await this.board.find();
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
  async findOne(id: string) {
    const data = await this.board.findOneBy({ id });
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }

  async create(req: Request, board: Board) {
    if (req.user?.username) {
      board.userid = req.user.username;
      board.createdday = `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`;
    }
    const data = await this.board.save(board);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '등록 성공',
    );
  }
  async update(id: string, board: Board) {
    const data = await this.board.update(id, board);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '수정 성공',
    );
  }
  async delete(id: string) {
    console.log('delete', id);
    const data = await this.board.delete(id);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '삭제 성공',
    );
  }
}
