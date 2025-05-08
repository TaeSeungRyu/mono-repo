import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private board: Repository<Board>,
  ) {}

  async findAll() {
    return await this.board.find();
  }
  async findOne(id: string) {
    return await this.board.findOneBy({ id });
  }

  async create(req: Request, board: Board) {
    if (req.user?.username) {
      board.userid = req.user.username;
      board.createdday = `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`;
    }
    return await this.board.save(board);
  }
  async update(id: string, board: Board) {
    return await this.board.update(id, board);
  }
  async delete(id: string) {
    return await this.board.delete(id);
  }
}
