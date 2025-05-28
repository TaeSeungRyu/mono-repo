import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScrappingRunnerService } from '../application/service/scrapping.service';
import { ScrappingDto } from '../domain/scrapping.dto';

@Controller('scrapping')
export class ScrappingController {
  constructor(private service: ScrappingRunnerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  public async get(@Query() req: ScrappingDto) {
    return this.service.find(req);
  }
}
