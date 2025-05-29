import { Injectable } from '@nestjs/common';
import { CommonUseCase } from 'src/common/common.usecase';
import { GithubDto } from '../../domain/user.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseDto } from 'src/common/common.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class FindGihubUseCase implements CommonUseCase<GithubDto> {
  constructor(private readonly httpService: HttpService) {}

  async execute(req: GithubDto): Promise<ResponseDto> {
    const url = `${process.env.GITHUB_URL}/repos/${process.env.GITHUB_REPO}/commits?sha=${process.env.GITHUB_BRANCH}`;
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    };
    this.httpService.axiosRef.defaults.headers.common = headers;
    try {
      const response: AxiosResponse<unknown> =
        await this.httpService.axiosRef.get(url, {
          params: {
            per_page: 10,
            page: req.page || 1,
          },
        });
      if (response?.data) {
        const data = response.data as Record<string, unknown>[];
        return new ResponseDto(
          { success: true, data },
          'success',
          '커밋 정보 조회 성공',
        );
      }
      return new ResponseDto(
        { success: false, data: null },
        'error',
        '커밋 정보 조회 실패',
      );
    } catch (error) {
      console.error('Error fetching commits:', error);
      return new ResponseDto(
        { success: false, data: null },
        'error',
        '커밋 정보 조회 실패',
      );
    }
  }
}
