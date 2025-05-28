import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async getCommits(page: number = 1): Promise<any> {
    const url = `${process.env.GITHUB_URL}/repos/${process.env.GITHUB_REPO}/commits?sha=${process.env.GITHUB_BRANCH}`;
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    };
    this.httpService.axiosRef.defaults.headers.common = headers;
    try {
      const response = await this.httpService.axiosRef.get(url, {
        params: {
          per_page: 100, // Adjust as needed
          page: page, // You can implement pagination if needed
        },
      });
      console.log('test commits from GitHub:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw new Error('Failed to fetch commits from GitHub');
    }
  }
}
