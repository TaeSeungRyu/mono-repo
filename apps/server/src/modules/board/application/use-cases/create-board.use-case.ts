import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Board } from '../../domain/board.entity';
import { ResponseDto } from 'src/common/common.dto';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { SseService } from 'src/modules/sse/application/service/sse.service';

@Injectable()
export class CreateBoardUseCase
  implements CommonUseCase<{ req: Request; board: Board }>
{
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    private readonly sseService: SseService,
  ) {}

  async execute({
    req,
    board,
  }: {
    req: Request;
    board: Board;
  }): Promise<ResponseDto> {
    if (req.user?.username) {
      board.userid = req.user.username;
      board.createdday = `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`;
    }
    const data = await this.boardRepo.save(board);

    this.sseService.publishEvent({
      event: 'board',
      data: {
        data: data || {},
        user: req.user || {},
      },
    });

    return new ResponseDto(
      { success: true, data: data },
      'success',
      '등록 성공',
    );
  }
}
