import { fetcher } from "@/app/lib/useFetch";
import { CalendarRepository } from "../../domain/calendar/CalendarRepository";
import { CommonResponse } from "../../domain/CommonResponse";
import { API } from "@/app/types/const";

export class RepoCalendarRepositoryImpl implements CalendarRepository {
  async selectByScheduleday(startDay: string, endDay: string): Promise<any> {
    const query = new URLSearchParams({
      startDay,
      endDay,
    });
    const meResult = await fetcher(`${API.CALENDAR}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { result } = await meResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async insert(calendar: any): Promise<any> {
    const meResult = await fetcher(API.CALENDAR_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendar),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async update(calendar: any): Promise<any> {
    const meResult = await fetcher(`${API.CALENDAR_UPDATE}/${calendar.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendar),
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async delete(id: string): Promise<any> {
    const meResult = await fetcher(`${API.CALENDAR_DELETE}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { data } = await meResult.json();
        resolve(new CommonResponse({ data, success: meResult.success }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
