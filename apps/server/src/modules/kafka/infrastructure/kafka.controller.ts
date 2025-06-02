// kafka/kafka.controller.ts
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { KafkaService } from '../application/kafka.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';

@Controller('kafka')
export class KafkaController {
  constructor(private service: KafkaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  public addData(
    @Req() req: Request,
    @Body('message') message: string,
  ): ResponseDto {
    this.service.sendMessage('my-topic', req, message);
    return new ResponseDto(
      { success: true, data: { message } },
      'success',
      '요청 성공',
    );
  }
}
