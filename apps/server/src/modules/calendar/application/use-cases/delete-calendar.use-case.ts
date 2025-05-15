import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { Calendar } from '../../domain/calendar.entity';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCalendarUseCase implements CommonUseCase<string> {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}
  async execute(id: string): Promise<ResponseDto> {
    const data = await this.calendarRepo.delete(id);
    return new ResponseDto(
      { success: true, data: data },
      'success',
      '삭제 성공',
    );
  }
}
