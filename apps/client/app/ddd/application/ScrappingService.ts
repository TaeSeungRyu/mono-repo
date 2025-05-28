import { ScrappingRepository } from "../domain/scrapping/ScrappingRepository";

export class ScrappingService {
  private static instance: ScrappingService;
  private repository: ScrappingRepository;
  private constructor(repository: ScrappingRepository) {
    this.repository = repository;
  }

  //싱글톤 패턴 적용
  static getInstance(repository: ScrappingRepository): ScrappingService {
    if (!ScrappingService.instance) {
      ScrappingService.instance = new ScrappingService(repository);
    }
    return ScrappingService.instance;
  }

  async findWithPage(page: number, limit: number) {
    const data = await this.repository.findWithPage(page, limit);
    return data;
  }
}
