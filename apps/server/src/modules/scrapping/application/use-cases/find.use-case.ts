import { InjectRepository } from '@nestjs/typeorm';
import { CommonUseCase } from 'src/common/common.usecase';
import { Repository } from 'typeorm';
import { ResponseDto } from 'src/common/common.dto';
import { Injectable } from '@nestjs/common';
import { Scrapping } from '../../domain/scrapping.entity';
import { ScrappingDto } from '../../domain/scrapping.dto';

@Injectable()
export class FindScrappingWithPagingUseCase
  implements CommonUseCase<ScrappingDto>
{
  constructor(
    @InjectRepository(Scrapping)
    private readonly scrapingRepo: Repository<Scrapping>,
  ) {}

  async execute(req: ScrappingDto): Promise<ResponseDto> {
    const query = this.scrapingRepo.createQueryBuilder('scrapping');
    const page = req.page || 1;
    const limit = req.limit || 10;
    query
      .skip((page - 1) * limit)
      .take(limit)
      .select(['scrapping.id', 'scrapping.contents', 'scrapping.createdday'])
      .orderBy('scrapping.id', 'DESC');
    const [data, total] = await query.getManyAndCount();
    const totalPage = Math.ceil(total / limit);

    return new ResponseDto(
      {
        success: true,
        data: {
          data,
          total,
          page,
          limit,
          totalPage,
        },
      },
      'success',
      '조회 성공',
    );
  }
}
