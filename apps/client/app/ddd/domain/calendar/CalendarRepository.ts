import { CommonResponse } from "../CommonResponse";
import { Calendar } from "./Repo";

//[use case] Domain Layer
export interface CalendarRepository {
  selectByScheduleday(
    startDay: string,
    endDay: string,
  ): Promise<CommonResponse>;
  insert(arg: Calendar): Promise<CommonResponse>;
  update(arg: Calendar): Promise<CommonResponse>;
  delete(id: string): Promise<CommonResponse>;
}
