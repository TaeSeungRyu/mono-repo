import { BoardRepository } from "../../domain/board/BoardRepository";
import { Board } from "../../domain/board/Repo";
import { CommonResponse } from "../../domain/CommonResponse";

export class RepoBoardRepositoryImpl implements BoardRepository {
  async selectAll(): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async selectById(id: number): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async insert(board: Board): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async update(board: Board): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async delete(id: number): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board?idx=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
