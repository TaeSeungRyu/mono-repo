import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class SseService {
  private stream: {
    //접속한 브라우저의 커넥션을 담을 객체
    id: string;
    subject: ReplaySubject<unknown>;
    observer: Observable<unknown>;
  }[] = [];
  constructor() {}

  addStream(response: Response) {
    const newId = randomUUID();
    response.on('close', () => this.removeStream(newId));
    const subject = new ReplaySubject();
    const observer = subject.asObservable();
    this.stream.push({ id: newId, subject, observer });
  }

  removeStream(id: string): void {
    //브라우저가 종료될 때 대상에서 제거 합니다.
    this.stream = this.stream.filter((stream) => stream.id !== id);
  }
}
