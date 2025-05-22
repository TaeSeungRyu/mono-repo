import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CalendarController } from './infrastructure/calendar.controller';
import { Calendar } from './domain/calendar.entity';
import { CreateCalendarUseCase } from './application/use-cases/create-calendar.use-case';
import { DeleteCalendarUseCase } from './application/use-cases/delete-calendar.use-case';
import { UpdateCalendarUseCase } from './application/use-cases/update-calendar.use-case';
import { FindCalendarUseCase } from './application/use-cases/find-calendar.use-case';
import { CalendarService } from './application/services/calendar.service';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [SseModule, TypeOrmModule.forFeature([Calendar])],
  providers: [
    CreateCalendarUseCase,
    DeleteCalendarUseCase,
    UpdateCalendarUseCase,
    FindCalendarUseCase,
    CalendarService,
  ],
  controllers: [CalendarController],
  exports: [],
})
export class CalendarModule {}
/**

src/
└── modules/
    └── user/
        ├── application/          <-- 유스케이스, 서비스
        │   ├── use-cases/
        │   │   └── create-user.use-case.ts
        │   └── services/
        │       └── user-app.service.ts
        ├── domain/               <-- 엔티티, 리포지토리 인터페이스, VO, 도메인 서비스
        │   └── entities/
        ├── infrastructure/       <-- 컨트롤러, 구현체(리포지토리, 외부 API 등)
        │   └── http/
        │       └── controllers/
        │           └── user.controller.ts
        └── user.module.ts

 */
