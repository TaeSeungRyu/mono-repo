//[use case] Domain Layer
export interface ScrappingRepository {
  findWithPage(page: number, limit: number): Promise<any>;
}
