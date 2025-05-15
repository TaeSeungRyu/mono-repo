import { CommonResponse } from "../CommonResponse";
import { Calendar } from "./Repo";

//[use case] Domain Layer
export interface CalendarRepository {
  selectByScheduleday(
    startDay: string,
    endDay: string,
  ): Promise<CommonResponse>;
  insert(board: Calendar): Promise<CommonResponse>;
  update(board: Calendar): Promise<CommonResponse>;
  delete(id: string): Promise<CommonResponse>;
}
