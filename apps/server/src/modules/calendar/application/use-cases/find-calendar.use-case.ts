import { isInvalidDate_FROM_COMMON_UTILS } from 'my-common-utils';

import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Calendar } from '../../domain/calendar.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindCalendarUseCase implements CommonUseCase<string> {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}
  async execute(scheduleday: string): Promise<ResponseDto> {
    const validCheck = isInvalidDate_FROM_COMMON_UTILS as (
      arg?: string,
    ) => boolean;
    if (validCheck(scheduleday)) {
      return new ResponseDto(
        { success: false, data: null },
        'error',
        '날짜 형식이 잘못되었습니다.',
      );
    }
    const data = await this.calendarRepo.find({ where: { scheduleday } });
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '조회 성공',
    );
  }
}
