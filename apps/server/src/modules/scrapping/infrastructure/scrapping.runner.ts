import { Injectable } from '@nestjs/common';
import { ScrappingRunnerService } from '../application/service/scrapping.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScrappingRunner {
  constructor(private scrappingRunnerService: ScrappingRunnerService) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'SCRAPPING_RUNNER',
    timeZone: 'Asia/Seoul',
  })
  excute() {
    this.scrappingRunnerService.excute();
  }
}
