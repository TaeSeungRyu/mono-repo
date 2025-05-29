export interface GithubRepository {
  findWithPage(page: number, limit: number): Promise<any>;
}
