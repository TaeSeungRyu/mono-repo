import { KafkaOptions, Transport } from '@nestjs/microservices';

export const KAFKA_OPTION: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'], // Kafka 브로커 주소
    },
    consumer: {
      groupId: 'nestjs-consumer-group', // 그룹 ID
    },
  },
};
