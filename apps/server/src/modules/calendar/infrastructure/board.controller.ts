import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CalendarService } from '../application/services/calendar.service';
import { Calendar } from '../domain/calendar.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private service: CalendarService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':scheduleday')
  public async get(@Param('scheduleday') scheduleday: string) {
    return await this.service.find(scheduleday);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  public async create(@Req() req: Request, @Body() body: Calendar) {
    return await this.service.create(req, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  public async update(@Param('id') id: string, @Body() body: Calendar) {
    return await this.service.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete/:id')
  public async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
