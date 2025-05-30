// kafka/kafka.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { KafkaService } from '../application/kafka.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from 'src/common/common.dto';

@Controller('kafka')
export class KafkaController {
  constructor(private service: KafkaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('add')
  public addData(@Query('message') message: string): ResponseDto {
    this.service.sendMessage('my-topic', { value: message });
    return new ResponseDto(
      { success: true, data: { message } },
      'success',
      '등록 성공',
    );
  }
}
