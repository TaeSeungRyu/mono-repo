import { Injectable } from '@nestjs/common';
import { SseClient } from '../../domain/sse.dto';
@Injectable()
export class RemoveClientUseCase {
  constructor() {}
  execute(
    clients: SseClient[],
    id: string | undefined,
    forceShutDown?: boolean,
  ): SseClient[] {
    return clients.filter((stream) => {
      const isKeepGoingClient = stream.id !== id;
      if (!isKeepGoingClient && forceShutDown == true) {
        stream?.response?.status(500)?.end();
      }
      return isKeepGoingClient;
    });
  }
}
