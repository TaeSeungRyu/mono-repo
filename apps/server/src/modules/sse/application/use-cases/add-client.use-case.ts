import { Injectable } from '@nestjs/common';
import { SseClient, SseUseCaseType } from '../../domain/sse.dto';
import { randomUUID } from 'crypto';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class AddClientUseCase {
  constructor() {}
  async execute(clients: SseClient[]): Promise<SseUseCaseType> {
    const newId = randomUUID();
    const subject = new ReplaySubject<SseClient>();
    const observer = subject.asObservable();
    clients.push({ id: newId, subject, observer });
    return new Promise((resolve) => {
      resolve({
        result: true,
        data: {
          id: newId,
          subject: subject,
          observer: observer,
        },
      });
    });
  }
}
