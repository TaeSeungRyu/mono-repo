import { GithubRepository } from "../domain/github/GithubRepository";

export class GithubService {
  private static instance: GithubService;
  private repository: GithubRepository;
  private constructor(repository: GithubRepository) {
    this.repository = repository;
  }

  //싱글톤 패턴 적용
  static getInstance(repository: GithubRepository): GithubService {
    if (!GithubService.instance) {
      GithubService.instance = new GithubService(repository);
    }
    return GithubService.instance;
  }

  async findWithPage(page: number, limit: number) {
    const data = await this.repository.findWithPage(page, limit);
    return data;
  }
}
