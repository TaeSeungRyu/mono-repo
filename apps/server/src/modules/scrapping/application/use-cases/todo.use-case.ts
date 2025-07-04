import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scrapping } from '../../domain/scrapping.entity';
import { Repository } from 'typeorm';
import puppeteer from 'puppeteer';
import { parseDateSample_FROM_COMMON_UTILS } from 'my-common-utils';

@Injectable()
export class TodoUseCase {
  private readonly logger = new Logger(TodoUseCase.name);

  static readonly TARGET_URL = 'https://news.naver.com/';
  constructor(
    @InjectRepository(Scrapping)
    private readonly scrappingRepo: Repository<Scrapping>,
  ) {}
  async excute() {
    const browser = await puppeteer.launch({
      headless: true, // Set to false if you want to see the browser
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    browser.on('disconnected', () => {
      this.logger.log('Browser disconnected, reinitializing...');
    });
    const page = await browser.newPage();
    await page.goto(TodoUseCase.TARGET_URL);
    const contents = await page.content();

    await this.scrappingRepo.save({
      contents: contents,
      createdday: `${(parseDateSample_FROM_COMMON_UTILS as (arg?: string) => string)()}`,
    });

    await browser.close();
  }
}
