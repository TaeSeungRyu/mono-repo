import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SseService } from '../../sse/application/service/sse.service';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly sseService: SseService,
  ) {}

  //메시지 전송, 소비
  sendMessage(topic: string, message: any): void {
    this.kafkaClient.emit(topic, message);
  }

  //메시지 수신, SSE로 전달
  receiveMessage(topic: string, message: Record<string, any>): void {
    this.sseService.publishEvent({
      event: 'kafka-message',
      data: { topic, message: message || '' },
      id: topic,
    });
  }
}
