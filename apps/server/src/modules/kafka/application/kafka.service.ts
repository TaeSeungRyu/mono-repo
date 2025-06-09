import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SseService } from '../../sse/application/service/sse.service';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';
import { Request } from 'express';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly sseService: SseService,
  ) {}

  //메시지 전송, 소비
  sendMessage(topic: string, req: Request, message: string): void {
    this.kafkaClient
      .emit(topic, { message, username: req?.user?.username || '' })
      .subscribe({
        next: (response) => {
          // 메시지 전송 성공 시 로깅(성공에 따른 sse 발송 또는 웹훅)
          this.logger.log(`Message sent to topic ${topic}:`, response);
        },
        error: (error) => {
          // 메시지 전송 실패 시 에러 로깅(실패에 따른  sse 발송 또는 웹훅)
          this.logger.error(`Error sending message to topic ${topic}:`, error);
        },
      });
  }

  //메시지 수신, SSE로 전달
  receiveMessage(topic: string, message: Record<string, any>): void {
    let username: string = '';
    let messageContent: string = '';
    if (message?.username) {
      username = message.username as string;
    }
    if (message?.message) {
      messageContent = message?.message as string;
    }
    this.sseService.publishEvent({
      event: 'kafka',
      data: {
        topic,
        content: messageContent || '',
        createdday: `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`,
        username: username,
        user: {
          username: username,
        },
      },
      id: topic,
    });
  }
}
