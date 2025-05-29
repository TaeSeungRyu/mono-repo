import { fetcher } from "@/app/lib/useFetch";
import { GithubRepository } from "../../domain/github/GithubRepository";
import { API } from "@/app/types/const";
import { CommonResponse } from "../../domain/CommonResponse";

export class RepoGithubRepositoryImpl implements GithubRepository {
  async findWithPage(page: number, limit: number): Promise<any> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const findResult = await fetcher(`${API.GITHUB}?${query}`, {
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
        reject(new Error("DB Query Error"));
      }
    });
  }
}
