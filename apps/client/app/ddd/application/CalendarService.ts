import { CalendarRepository } from "../domain/calendar/CalendarRepository";
import { CommonResponse } from "../domain/CommonResponse";

export class CalendarService {
  private static instance: CalendarService;
  private repository: CalendarRepository;
  private constructor(repository: CalendarRepository) {
    this.repository = repository;
  }

  //싱글톤 패턴 적용
  static getInstance(repository: CalendarRepository): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService(repository);
    }
    return CalendarService.instance;
  }

  async selectByScheduleday(
    startDay: string,
    endDay: string,
  ): Promise<CommonResponse> {
    if (!startDay || !endDay) {
      return new CommonResponse({
        data: null,
        success: false,
        message: "스케줄 날짜가 없습니다.",
      });
    }
    const data = await this.repository.selectByScheduleday(startDay, endDay);
    return data;
  }
  async insertData(arg: any): Promise<CommonResponse> {
    const data = await this.repository.insert(arg);
    return data;
  }
  async updateData(arg: any): Promise<CommonResponse> {
    const data = await this.repository.update(arg);
    return data;
  }
  async deleteData(id: string): Promise<CommonResponse> {
    const data = await this.repository.delete(id);
    return data;
  }
}
