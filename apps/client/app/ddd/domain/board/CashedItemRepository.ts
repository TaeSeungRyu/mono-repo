import { CommonResponse } from "../CommonResponse";

//[use case] Domain Layer
export interface CashedItemRepository {
  selectAll(): Promise<CommonResponse>;
}
