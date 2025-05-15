import { isInvalidDate_FROM_COMMON_UTILS } from 'my-common-utils';

import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Between, Repository } from 'typeorm';
import { Calendar } from '../../domain/calendar.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindCalendarUseCase
  implements CommonUseCase<{ startDay: string; endDay: string }>
{
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}
  async execute({
    startDay,
    endDay,
  }: {
    startDay: string;
    endDay: string;
  }): Promise<ResponseDto> {
    const validCheck = isInvalidDate_FROM_COMMON_UTILS as (
      arg?: string,
    ) => boolean;
    if (!validCheck(startDay) || !validCheck(endDay)) {
      return new ResponseDto(
        { success: false, data: null },
        'error',
        '날짜 형식이 잘못되었습니다.',
      );
    }
    const data = await this.calendarRepo.find({
      where: { scheduleday: Between(startDay, endDay) },
    });
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
