import { Injectable } from '@nestjs/common';
import { SseClient } from '../../domain/sse.dto';
@Injectable()
export class RemoveClientUseCase {
  constructor() {}
  execute(clients: SseClient[], id: string | undefined): SseClient[] {
    return clients.filter((stream) => stream.id !== id);
  }
}
