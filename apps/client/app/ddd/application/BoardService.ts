import { BoardRepository } from "../domain/board/BoardRepository";
import { Board } from "../domain/board/Repo";
import { CommonResponse } from "../domain/CommonResponse";

export class BoardService {
  private static instance: BoardService;
  private repository: BoardRepository;
  private constructor(repository: BoardRepository) {
    this.repository = repository;
  }

  //싱글톤 패턴 적용
  static getInstance(repository: BoardRepository): BoardService {
    if (!BoardService.instance) {
      BoardService.instance = new BoardService(repository);
    }
    return BoardService.instance;
  }

  async selectDataAll(): Promise<CommonResponse> {
    const data = await this.repository.selectAll();
    return data;
  }
  async selectDataById(id: string): Promise<CommonResponse> {
    const data = await this.repository.selectById(id);
    return data;
  }
  async insertData(board: any): Promise<CommonResponse> {
    const data = await this.repository.insert(board);
    return data;
  }
  async updateData(board: any): Promise<CommonResponse> {
    const data = await this.repository.update(board);
    return data;
  }
  async deleteData(id: string): Promise<CommonResponse> {
    const data = await this.repository.delete(id);
    return data;
  }

  changeBoardItem(key: string, prevList: any, item: any, e: any) {
    return prevList.map((board: Board) =>
      board.id === item.id ? { ...board, [key]: e.target.value } : board,
    );
  }
}
