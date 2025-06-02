import { KafkaRepository } from "../domain/kafka/KafkaRepository";

export class KafkaService {
  private static instance: KafkaService;
  private repository: KafkaRepository;
  private constructor(repository: KafkaRepository) {
    this.repository = repository;
  }

  //싱글톤 패턴 적용
  static getInstance(repository: KafkaRepository): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService(repository);
    }
    return KafkaService.instance;
  }

  async add(message: string) {
    const data = await this.repository.add(message);
    return data;
  }
}
