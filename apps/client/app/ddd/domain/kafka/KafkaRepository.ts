import { CommonResponse } from "../CommonResponse";

//[use case] Domain Layer
export interface KafkaRepository {
  add(message: string): Promise<CommonResponse>;
}
