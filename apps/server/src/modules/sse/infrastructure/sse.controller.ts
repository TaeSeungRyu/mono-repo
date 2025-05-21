import { Controller, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { MessageEvent } from '../domain/sse.dto';

@Controller('events')
export class SseController {
  constructor() {}
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map(() => ({ data: { hello: 'world' } })));
  }
}
