import { fetcher } from "@/app/lib/useFetch";
import { BoardRepository } from "../../domain/board/BoardRepository";
import { Board } from "../../domain/board/Repo";
import { CommonResponse } from "../../domain/CommonResponse";
import { API } from "@/app/types/const";

export class RepoBoardRepositoryImpl implements BoardRepository {
  async selectAll(): Promise<CommonResponse> {
    const meResult = await fetcher(API.BOARD, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { result } = await meResult.json();
        resolve(new CommonResponse({ data: result.data, success: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async selectById(id: string): Promise<CommonResponse> {
    const meResult = await fetcher(`${API.BOARD}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async insert(board: Board): Promise<CommonResponse> {
    const meResult = await fetcher(API.BOARD_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async update(board: Board): Promise<CommonResponse> {
    const meResult = await fetcher(`${API.BOARD_UPDATE}/${board.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async delete(id: string): Promise<CommonResponse> {
    const meResult = await fetcher(`${API.BOARD_DELETE}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
