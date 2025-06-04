import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';

// 로그 디렉터리 생성
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const winstonLoggerOptions: winston.LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('my-mono-repo', {
          prettyPrint: true,
        }),
      ),
    }),

    // 일 단위 일반 로그
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: logDir,
      filename: '%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d', // 14일 뒤 자동 삭제
    }),

    // 일 단위 에러 로그
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: logDir,
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
};
