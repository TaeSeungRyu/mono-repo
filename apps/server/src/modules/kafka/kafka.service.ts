import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  // Kafka 서비스 로직을 여기에 구현합니다.
  // 예: 메시지 전송, 소비 등
  sendMessage(topic: string, message: any): void {
    this.kafkaClient.emit(topic, message);
    console.log(`Message sent to topic ${topic}:`, message);
  }

  receiveMessage(topic: string): void {
    console.log(`Receiving messages from topic ${topic}`);
    // 실제 Kafka 클라이언트를 사용하여 메시지를 수신하는 로직을 구현합니다.
  }
}
