// kafka/kafka.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaTcpController {
  @MessagePattern('my-topic') //Topic 이름 ./kafka-topics.sh --bootstrap-server localhost:9092 --create --topic my-topic
  handleKafkaMessage(@Payload() message: Record<string, any>) {
    console.log('📥 Kafka 메시지 수신:', message?.value);
  }
}
