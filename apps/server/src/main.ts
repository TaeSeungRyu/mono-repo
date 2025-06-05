import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KAFKA_OPTION } from './const';
import { winstonLoggerOptions } from './logger/winston-logger.option';
import { WinstonModule } from 'nest-winston';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });
  if (app) {
    const parser = cookieParser();
    app.use(parser);
    // Kafka 마이크로서비스 연결
    app.connectMicroservice<MicroserviceOptions>(KAFKA_OPTION);
  }
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
