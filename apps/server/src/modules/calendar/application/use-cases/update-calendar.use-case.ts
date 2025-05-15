import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Calendar } from '../../domain/calendar.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateCalendarUseCase
  implements CommonUseCase<{ id: string; calendar: Calendar }>
{
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}
  async execute({
    id,
    calendar,
  }: {
    id: string;
    calendar: Calendar;
  }): Promise<ResponseDto> {
    const data = await this.calendarRepo.update(id, calendar);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '수정 성공',
    );
  }
}
