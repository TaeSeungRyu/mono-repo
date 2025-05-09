import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [],
  controllers: [],
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
