import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Response } from 'express';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MessageEvent, SseClient, SseEvent } from '../../domain/sse.dto';
import { IsSigninUserUseCase } from '../use-cases/is-signin-user.use-case';
import { AddClientUseCase } from '../use-cases/add-client.use-case';
import { RemoveClientUseCase } from '../use-cases/remove-client.use-case';

//TODO : 이벤트를 주고받기 위한 타입이 정의되어 있지 않습니다.
@Injectable()
export class SseService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(SseService.name);

  private clients: SseClient[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  //다른 도메인에서 발생한 이벤트를 전달하기 위한 객체
  private eventBus: BehaviorSubject<SseEvent>;
  constructor(
    private readonly isSigninUserUseCase: IsSigninUserUseCase,
    private readonly addClientUseCase: AddClientUseCase,
    private readonly removeClientUseCase: RemoveClientUseCase,
  ) {
    this.eventBus = new BehaviorSubject({
      event: '',
      data: {},
      id: '',
    });
  }

  onModuleInit() {
    this.pintRunner();
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.logger.log('Ping runner stopped');
    }
  }

  pintRunner() {
    this.intervalId = setInterval(() => {
      this.publishEvent({
        event: 'ping',
        data: {},
        id: '',
      });
    }, 60000); // 10초마다 ping 이벤트 발행
  }

  /**
   * @param data 이벤트 전달용 데이터 입니다.
   */
  publishEvent(data: SseEvent) {
    this.eventBus.next(data);
    this.logger.log(`Event published: ${data.event}`, data);
  }

  /**
   * 이벤트 구독을 실행 합니다.
   */
  runSubscribe() {
    this.eventBus.subscribe((data) => {
      this.clients.forEach((stream) => {
        stream.subject.next({
          event: data.event,
          data: data || {},
        });
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
  async addClient(
    id: string,
    response: Response,
  ): Promise<Observable<MessageEvent>> {
    const isUser = await this.isSigninUserUseCase.execute(id);
    if (!isUser.result) {
      response.status(401).end();
      return new Observable<MessageEvent>();
    }
    const { result, data } = await this.addClientUseCase.execute(
      this.clients,
      response,
    );
    if (!result || !data) {
      response.status(500).end();
      return new Observable<MessageEvent>();
    }
    const identity = data?.id;
    const observer = data?.observer;
    if (!observer || identity === undefined) {
      response.status(500).end();
      return new Observable<MessageEvent>();
    }
    response.on('close', () => {
      this.clients = this.removeClientUseCase.execute(this.clients, identity);
    });
    return observer.pipe(
      map((data) => {
        //브라우저에 전송할 데이터
        const result: MessageEvent = {
          id: identity,
          data: data || {},
        };
        return result;
      }),
    );
  }
}
