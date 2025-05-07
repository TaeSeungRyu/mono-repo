import { CommonResponse } from "../CommonResponse";
import { Board } from "./Repo";

export interface BoardRepository {
  selectAll(): Promise<CommonResponse>;
  selectById(id: number): Promise<CommonResponse>;
  insert(board: Board): Promise<CommonResponse>;
  update(board: Board): Promise<CommonResponse>;
  delete(id: number): Promise<CommonResponse>;
}
