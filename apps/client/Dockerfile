#docker build -t my-next-js .
#docker run -d --name my-next-js -p 3000:3000 my-next-js    // 외부:내부

# 1. 기본 이미지(빌드 이미지)
FROM node:18-alpine AS base

# 2. 의존성 install 
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 3. 파일 복사 및 빌드
COPY . .
RUN yarn build

# 4. 빌드 완료 후 불필요한 파일 삭제
RUN rm -rf /app/node_modules

# 5. 프로덕션 이미지
FROM node:18-alpine AS production

# 6. 작업 디렉토리 설정 및 필요한 파일만 복사
WORKDIR /app

COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

# 8. 포트 설정
EXPOSE 3000

# 9. 실행 명령어
CMD ["node", "server.js", "-H", "0.0.0.0", "-p", "3000"]
