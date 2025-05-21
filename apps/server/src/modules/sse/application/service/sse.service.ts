import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { BehaviorSubject, map, Observable, ReplaySubject } from 'rxjs';
import { MessageEvent } from '../../domain/sse.dto';

//TODO : 이벤트를 주고받기 위한 타입이 정의되어 있지 않습니다.
@Injectable()
export class SseService {
  private clients: {
    //접속한 브라우저의 커넥션을 담을 객체
    id: string;
    subject: ReplaySubject<unknown>;
    observer: Observable<unknown>;
  }[] = [];

  //다른 도메인에서 발생한 이벤트를 전달하기 위한 객체
  private eventBus: BehaviorSubject<unknown>;
  constructor() {
    this.eventBus = new BehaviorSubject(null);
  }

  /**
   * @param data 이벤트 전달용 데이터 입니다.
   */
  publishEvent(data: unknown) {
    this.eventBus.next(data);
  }

  /**
   * 이벤트 구독을 실행 합니다.
   */
  runSubscribe() {
    this.eventBus.subscribe((data) => {
      this.clients.forEach((stream) => {
        stream.subject.next({ hello: 'world', data });
      });
    });
  }

  /**
   * 이벤트 구독을 종료 합니다.
   */
  stopSubscribe() {
    if (this.eventBus) {
      this.eventBus.unsubscribe();
    }
  }

  /**
   *
   * @param response 브라우저의 응답 객체 입니다.
   * @returns 브라우저에 전송할 데이터 입니다.
   * @description 접속한 브라우저의 커넥션을 담고 있는 객체를 생성합니다.
   */
  addClient(response: Response): Observable<MessageEvent> {
    const newId = randomUUID();
    response.on('close', () => this.removeClient(newId));
    const subject = new ReplaySubject();
    const observer = subject.asObservable();
    this.clients.push({ id: newId, subject, observer });
    return observer.pipe(
      map(() => {
        //브라우저에 전송할 데이터
        const data: MessageEvent = {
          id: newId,
          data: { hello: 'world' },
        };
        return data;
      }),
    );
  }

  /**
   *
   * @param id 브라우저의 커넥션 id 입니다.
   * @description 브라우저의 커넥션을 종료합니다.
   */
  private removeClient(id: string): void {
    this.clients = this.clients.filter((stream) => stream.id !== id);
  }
}
