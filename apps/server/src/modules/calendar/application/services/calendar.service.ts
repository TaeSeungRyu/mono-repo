import { Injectable } from '@nestjs/common';
import { CreateCalendarUseCase } from '../use-cases/create-calendar.use-case';
import { UpdateCalendarUseCase } from '../use-cases/update-calendar.use-case';
import { DeleteCalendarUseCase } from '../use-cases/delete-calendar.use-case';
import { FindCalendarUseCase } from '../use-cases/find-calendar.use-case';
import { Calendar } from '../../domain/calendar.entity';
import { Request } from 'express';

@Injectable()
export class CalendarService {
  constructor(
    private readonly createUseCase: CreateCalendarUseCase,
    private readonly updateUseCase: UpdateCalendarUseCase,
    private readonly deleteUseCase: DeleteCalendarUseCase,
    private readonly findUseCase: FindCalendarUseCase,
  ) {}

  async find(startDay: string, endDay: string) {
    return this.findUseCase.execute({ startDay, endDay });
  }

  async create(req: Request, calendar: Calendar) {
    return this.createUseCase.execute({ req, calendar });
  }
  async update(id: string, calendar: Calendar) {
    return this.updateUseCase.execute({ id, calendar });
  }
  async delete(id: string) {
    return this.deleteUseCase.execute(id);
  }
}
