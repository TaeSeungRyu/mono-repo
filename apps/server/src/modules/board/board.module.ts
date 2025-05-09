import { Module } from '@nestjs/common';
import { CreateBoardUseCase } from './application/use-cases/create-board.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './domain/board.entity';
import { DeleteBoardUseCase } from './application/use-cases/delete-board.use-case';
import { FindAllBoardUseCase } from './application/use-cases/find-all-board.use-case';
import { FindOneBoardUseCase } from './application/use-cases/find-one-board.use-case';
import { UpdateBoardUseCase } from './application/use-cases/update-board.use-case';
import { BoardService } from './application/services/board.service';
import { BoardController } from './infrastructure/board.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [
    CreateBoardUseCase,
    DeleteBoardUseCase,
    FindAllBoardUseCase,
    FindOneBoardUseCase,
    UpdateBoardUseCase,
    BoardService,
  ],
  controllers: [BoardController],
  exports: [],
})
export class BoardModule {}
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
