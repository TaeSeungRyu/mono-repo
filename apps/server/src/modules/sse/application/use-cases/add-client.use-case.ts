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
    id: string | undefined,
  ): Promise<SseUseCaseType> {
    //TODO : 차후에 아이디와 랜덤값을 추가로 배합해서 사용하는 것 으로 변경
    //지금 프로세스에서는 username으로 2개의 브라우저에서 로그인 시도시 처음 커낵션은 등록되어 sse 이벤트를 받지만,
    //나중에 들어오는 커넥션은 등록이 안되는 현상이 발생함
    //이유는 아이디가 같기 때문!
    const newId = id || randomUUID();
    const subject = new ReplaySubject<SseClient>();
    const observer = subject.asObservable();
    const isBackButtonPressedClient = clients.find(
      (client) => client.id === newId,
    );
    if (isBackButtonPressedClient) {
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
