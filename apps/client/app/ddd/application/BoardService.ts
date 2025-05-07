import { BoardRepository } from "../domain/board/BoardRepository";
import { CashedItemRepository } from "../domain/board/CashedItemRepository";
import { Board } from "../domain/board/Repo";
import { CommonResponse } from "../domain/CommonResponse";

export class BoardService {
  private static instance: BoardService;
  private repository: CashedItemRepository;
  private repository2: BoardRepository;
  private constructor(
    repository: CashedItemRepository,
    repository2: BoardRepository
  ) {
    this.repository = repository;
    this.repository2 = repository2;
  }

  //싱글톤 패턴 적용
  static getInstance(
    repository: CashedItemRepository,
    repository2: BoardRepository
  ): BoardService {
    if (!BoardService.instance) {
      BoardService.instance = new BoardService(repository, repository2);
    }
    return BoardService.instance;
  }

  async selectCashedDataAll(): Promise<CommonResponse> {
    const data = await this.repository.selectAll();
    return data;
  }
  async selectDataAll(): Promise<CommonResponse> {
    const data = await this.repository2.selectAll();
    return data;
  }
  async selectDataById(id: number): Promise<CommonResponse> {
    const data = await this.repository2.selectById(id);
    return data;
  }
  async insertData(board: any): Promise<CommonResponse> {
    const data = await this.repository2.insert(board);
    return data;
  }
  async updateData(board: any): Promise<CommonResponse> {
    const data = await this.repository2.update(board);
    return data;
  }
  async deleteData(id: number): Promise<CommonResponse> {
    const data = await this.repository2.delete(id);
    return data;
  }

  changeBoardItem(key: string, prevList: any, item: any, e: any) {
    return prevList.map((board: Board) =>
      board.idx === item.idx ? { ...board, [key]: e.target.value } : board
    );
  }
}
