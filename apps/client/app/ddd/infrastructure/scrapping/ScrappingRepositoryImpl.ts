import { fetcher } from "@/app/lib/useFetch";
import { ScrappingRepository } from "../../domain/scrapping/ScrappingRepository";
import { API } from "@/app/types/const";
import { CommonResponse } from "../../domain/CommonResponse";

export class ScrappingRepositoryImpl implements ScrappingRepository {
  async findWithPage(page: number, limit: number): Promise<any> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const findResult = await fetcher(`${API.SCRAPPING}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (findResult.ok) {
        const { result } = await findResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
