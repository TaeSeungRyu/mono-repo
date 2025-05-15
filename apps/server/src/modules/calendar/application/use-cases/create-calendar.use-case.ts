import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Calendar } from '../../domain/calendar.entity';
import { ResponseDto } from 'src/common/common.dto';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateCalendarUseCase
  implements CommonUseCase<{ req: Request; calendar: Calendar }>
{
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}
  async execute({
    req,
    calendar,
  }: {
    req: Request;
    calendar: Calendar;
  }): Promise<ResponseDto> {
    if (req.user?.username) {
      calendar.userid = req.user.username;
      calendar.createdday = `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`;
    }
    const data = await this.calendarRepo.save(calendar);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '등록 성공',
    );
  }
}
