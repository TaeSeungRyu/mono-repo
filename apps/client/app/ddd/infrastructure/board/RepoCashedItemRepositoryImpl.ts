import { CashedItemRepository } from "../../domain/board/CashedItemRepository";
import { CommonResponse } from "../../domain/CommonResponse";

export class RepoCashedItemRepositoryImpl implements CashedItemRepository {
  async selectAll(): Promise<CommonResponse> {
    const meResult = await fetch(`/api/board/cashed`, {
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
}
