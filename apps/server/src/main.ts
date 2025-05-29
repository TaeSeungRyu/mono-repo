import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

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

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  if (app) {
    const parser = cookieParser();
    app.use(parser);

    // Kafka 마이크로서비스 연결
    app.connectMicroservice<MicroserviceOptions>(KAFKA_OPTION);
  }
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
