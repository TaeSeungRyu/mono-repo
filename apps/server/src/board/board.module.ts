import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [BoardService],
  controllers: [],
  exports: [], // 다른 모듈에서 UserService를 사용할 수 있도록 export
})
export class BoardModule {}
