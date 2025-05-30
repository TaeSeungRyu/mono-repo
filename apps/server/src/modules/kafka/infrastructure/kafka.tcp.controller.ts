// kafka/kafka.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaService } from '../application/kafka.service';

@Controller()
export class KafkaTcpController {
  constructor(private service: KafkaService) {}

  @MessagePattern('my-topic') //Topic 이름 ./kafka-topics.sh --bootstrap-server localhost:9092 --create --topic my-topic
  handleKafkaMessage(@Payload() message: Record<string, any>) {
    this.service.receiveMessage('my-topic', message);
  }
}
