import {
  Controller,
  OnModuleDestroy,
  OnModuleInit,
  Res,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEvent } from '../domain/sse.dto';
import { SseService } from '../application/service/sse.service';
import { Response } from 'express';

@Controller('events')
export class SseController implements OnModuleInit, OnModuleDestroy {
  constructor(private service: SseService) {}

  public onModuleInit(): void {
    this.service.runSubscribe();
  }

  public onModuleDestroy(): void {
    this.service.stopSubscribe();
  }

  @Sse('sse')
  sse(@Res() response: Response): Observable<MessageEvent> {
    return this.service.addClient(response);
  }
}
