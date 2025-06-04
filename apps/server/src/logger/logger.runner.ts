import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerRunner {
  private readonly baseLogDir = path.resolve('logs');
  private readonly logger = new Logger(LoggerRunner.name);

  constructor() {}

  @Cron(CronExpression.EVERY_2_HOURS, {
    //여기를 나중에 원하는 시간별로..
    name: 'LOGGER_RUNNER',
    timeZone: 'Asia/Seoul',
  })
  excute() {
    this.logger.log('Log directory cleanup started.');

    const files = fs.readdirSync(this.baseLogDir);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    for (const file of files) {
      const filePath = path.join(this.baseLogDir, file);
      // 디렉토리는 건너뜀
      if (fs.statSync(filePath).isDirectory()) continue;
      const matched = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (!matched) continue;
      const fileDate = matched[1];
      if (fileDate >= today) continue; // 오늘 날짜거나 미래면 이동하지 않음
      const targetDir = path.join(this.baseLogDir, fileDate);
      const targetPath = path.join(targetDir, file);
      // 디렉토리 없으면 생성
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        this.logger.log(`Created directory: ${targetDir}`);
      }
      // 파일 이동
      fs.renameSync(filePath, targetPath);
      this.logger.log(`Moved ${file} → ${targetDir}/`);
    }
    this.logger.log('Log directory cleanup finished.');
  }
}
