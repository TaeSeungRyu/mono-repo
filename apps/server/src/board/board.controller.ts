import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { Request } from 'express';

@Controller('board')
export class BoardController {
  constructor(private service: BoardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  public async getAll() {
    return await this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getOne(id: string) {
    return await this.service.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  public async create(@Req() req: Request, @Body() body: Board) {
    return await this.service.create(req, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  public async update(@Param('id') id: string, @Body() body: Board) {
    return await this.service.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete/:id')
  public async delete(id: string) {
    return await this.service.delete(id);
  }
}
