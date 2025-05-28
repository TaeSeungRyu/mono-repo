import { Injectable } from '@nestjs/common';
import { ScrappingRunnerService } from '../application/service/scrapping.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GithubService } from 'src/modules/github/github.service';

@Injectable()
export class ScrappingRunner {
  constructor(
    private scrappingRunnerService: ScrappingRunnerService,
    private githubservice: GithubService,
  ) {
    this.githubservice
      .getCommits()
      .then((res) => {
        console.log('test commits from GitHub:', res);
      })
      .catch((error) => {
        console.error('Error fetching commits:', error);
      });
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'SCRAPPING_RUNNER',
    timeZone: 'Asia/Seoul',
  })
  excute() {
    this.scrappingRunnerService.excute();
  }
}
