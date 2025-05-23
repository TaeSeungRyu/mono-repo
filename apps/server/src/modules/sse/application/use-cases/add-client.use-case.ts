import { Injectable } from '@nestjs/common';
import { SseClient, SseUseCaseType } from '../../domain/sse.dto';
import { randomUUID } from 'crypto';
import { ReplaySubject } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class AddClientUseCase {
  constructor() {}
  async execute(
    clients: SseClient[],
    response: Response,
  ): Promise<SseUseCaseType> {
    const newId = randomUUID();
    const subject = new ReplaySubject<SseClient>();
    const observer = subject.asObservable();

    clients.push({ id: newId, subject, observer, response });
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
