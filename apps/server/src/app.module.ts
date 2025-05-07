import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { RedisProviderModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

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
      entities: [User],
      synchronize: false, // dev용 자동 스키마 sync
    }),
    AuthModule,
    RedisProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
