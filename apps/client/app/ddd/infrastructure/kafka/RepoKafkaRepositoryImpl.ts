import { fetcher } from "@/app/lib/useFetch";

import { API } from "@/app/types/const";
import { CommonResponse } from "../../domain/CommonResponse";
import { KafkaRepository } from "../../domain/kafka/KafkaRepository";

export class RepoKafkaRepositoryImpl implements KafkaRepository {
  async add(message: string): Promise<any> {
    const findResult = await fetcher(`${API.KAFKA_ADD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
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
