import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RedisProviderModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { Board } from './modules/board/domain/board.entity';
import { BoardModule } from './modules/board/board.module';
import { User } from './modules/user/domain/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { Calendar } from './modules/calendar/domain/calendar.entity';
import { CalendarModule } from './modules/calendar/calendar.module';
import { Auth } from './modules/user/domain/auth.entity';
import { SseModule } from './modules/sse/sse.module';
import { Scrapping } from './modules/scrapping/domain/scrapping.entity';
import { ScrappingModule } from './modules/scrapping/scrapping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GithubModule } from './modules/github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 다른 모듈에서도 process.env 사용 가능
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Auth, Board, Calendar, Scrapping],
      synchronize: false, // dev용 자동 스키마 sync
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    RedisProviderModule,
    BoardModule,
    UserModule,
    CalendarModule,
    SseModule,
    ScrappingModule,
    GithubModule,
  ],
  controllers: [AppController],
  providers: [RedisService],
})
export class AppModule {}
