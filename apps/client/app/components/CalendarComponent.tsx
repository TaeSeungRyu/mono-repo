"use client";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { calculateDay, calendarType, DAT_OF_WEEK_KOR } from "./ComponentUtil";
import ArrowLeft from "../../public/left-arrow.svg";
import ArrowRight from "../../public/right-arrow.svg";
import Modal from "./Modal";
import YearPickerModal from "./YearPickerModal"; // ← 경로는 파일 위치에 따라 조정
import InputField from "./InputComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCalendarService } from "../ddd/actions";

const queryKey = "calendarList";

const CalendarComponent = () => {
  const queryClient = useQueryClient();
  const [calendarArray, setCalendarData] = useState<Array<calendarType>>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [calendarUpdateId, setCalendarUpdateId] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [calendarInfo, setCalendarInfo] = useState<any>(null);

  const buildCalendarDate = async (day: Dayjs = dayjs()) => {
    return new Promise((resolve) => {
      const newArray = calculateDay(day, (dayArray: any) => {});
      const _currentDayInMonth = newArray.find(
        (day: calendarType) => day.type == "current",
      );
      setCalendarData([...newArray]);
      setCurrentDate(_currentDayInMonth?.date || dayjs());
      resolve(true);
    });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 11); // 숫자만, 최대 11자리
    let formatted = raw;
    if (raw.length >= 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    }
    setPhoneNumber(formatted);
  };

  const handleLeftRightClick = (direction: string) => {
    const newDate =
      direction === "left"
        ? currentDate.subtract(1, "month").startOf("month")
        : currentDate.add(1, "month").startOf("month");
    buildCalendarDate(newDate).then(() => {
      refetch();
    });
  };

  const runModal = (day: calendarType) => {
    const dayDate = day.date.format("YYYY년 MM월 DD일");
    const dayOfWeekKor = day.dayOfWeekKor;
    setSelectedDate(day.date);
    setModalTitle(`${dayDate} (${dayOfWeekKor}요일)`);
    setPhoneNumber("");
    setContent("");
    setCalendarUpdateId(null);
    setIsOpen(true);
  };

  const runModalForUpdate = (day: calendarType, arg: any) => {
    const dayDate = day.date.format("YYYY년 MM월 DD일");
    const dayOfWeekKor = day.dayOfWeekKor;
    setSelectedDate(day.date);
    setModalTitle(`${dayDate} (${dayOfWeekKor}요일)`);
    setPhoneNumber(arg.phonenumber);
    setContent(arg.content);
    setCalendarUpdateId(arg.id);
    setIsOpen(true);
  };

  const runInfoModal = (day: calendarType) => {
    setIsInfoOpen(true);
    setCalendarInfo(day.option);
  };

  const runYearPicker = (arg: boolean) => {
    setShowYearPicker(arg);
  };

  //데이터 CURD 부분 -----
  const {
    data: calednarListDataFromServer = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data }: any = await useCalendarService.selectByScheduleday(
        calendarArray[0].stringFormat,
        calendarArray[calendarArray.length - 1].stringFormat,
      );
      return data;
    },
    gcTime: 0,
    staleTime: 1000,
    refetchOnMount: true,
    enabled: false,
  });

  useEffect(() => {
    buildCalendarDate(currentDate);
  }, []);

  //리팩토링중 -----------------
  const [tmpCalendarArray, setTmpCalendarArray] = useState<Array<calendarType>>(
    [],
  );
  const [startDay, setStartDay] = useState<string>("");
  const [endDay, setEndDay] = useState<string>("");
  const refectorying = () => {
    const days = calculateDay(currentDate, (dayArray: any) => {});
    setStartDay(
      days[0].stringFormat || dayjs().startOf("month").format("YYYY-MM-DD"),
    );
    setEndDay(
      days[days.length - 1].stringFormat ||
        dayjs().endOf("month").format("YYYY-MM-DD"),
    );
    setTmpCalendarArray(days);
    refetch();
  };

  useEffect(() => {
    const reArray = tmpCalendarArray.map((day: calendarType) => {
      day.option = [];
      calednarListDataFromServer.forEach((item: any) => {
        if (day.stringFormat == item.scheduleday) {
          day.option.push({
            id: item.id,
            content: item.content,
            phonenumber: item.phonenumber,
            scheduleday: item.scheduleday,
            userid: item.userid,
            createdday: item.createdday,
          });
        }
      });
      return day;
    });
    setCalendarData([...reArray]);
  }, [calednarListDataFromServer]);
  //리팩토링중 -----------------

  //TODO : 이걸 리팩토링 하려면,
  //1. 먼저 조회용 start, end 날짜를 선언 해야 합니다.
  //2. 그 날짜를 기준으로 데이터를 조회 합니다.
  //3. 데이터가 있든 없든지 간에 이때 배열을 생성하여 줍니다.
  //4. 그 배열을 기준으로 api 서버에서 가져온 데이터를 넣어 줍니다.
  //5. 그 배열을 기준으로 화면에 보여줍니다.(setCalendarData)
  //###### 이거 해결 안되면 캐싱 안되어 계속 서버에 요청함!(사실 리스트 데이터라서 캐싱이 필요 없음) ######

  useEffect(() => {
    if (calendarArray.length > 0 && calednarListDataFromServer.length > 0) {
      const reArray: Array<calendarType> = calendarArray.map(
        (day: calendarType) => {
          day.option = [];
          calednarListDataFromServer.forEach((item: any) => {
            if (day.stringFormat == item.scheduleday) {
              day.option.push({
                id: item.id,
                content: item.content,
                phonenumber: item.phonenumber,
                scheduleday: item.scheduleday,
                userid: item.userid,
                createdday: item.createdday,
              });
            }
          });
          return day;
        },
      );
      setCalendarData([...reArray]);
    }
  }, [calednarListDataFromServer]);

  const requestAlter = () => {
    if (!phoneNumber || !content) {
      alert("휴대폰 번호와 내용을 입력해주세요.");
      return;
    }
    if (calendarUpdateId) {
      if (!confirm("정말로 수정 하시겠습니까?")) return;
      updateMutation.mutate();
    } else {
      if (!confirm("정말로 추가 하시겠습니까?")) return;
      insertMutation.mutate();
    }
  };
  const requestDelete = () => {
    if (!confirm("정말로 삭제 하시겠습니까?")) return;
    deleteMutation.mutate();
  };

  const insertMutation = useMutation({
    mutationFn: async () => {
      await useCalendarService.insertData({
        phonenumber: phoneNumber,
        content,
        scheduleday: selectedDate?.format("YYYY-MM-DD"),
      });
    },
    onSuccess: () => {
      setPhoneNumber(""); // 입력 필드 초기화
      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await useCalendarService.updateData({
        id: calendarUpdateId,
        phonenumber: phoneNumber,
        content,
        scheduleday: selectedDate?.format("YYYY-MM-DD"),
      });
    },
    onSuccess: () => {
      setPhoneNumber(""); // 입력 필드 초기화
      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await useCalendarService.deleteData(`${calendarUpdateId}`);
    },
    onSuccess: () => {
      setPhoneNumber(""); // 입력 필드 초기화
      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return (
    <>
      <Modal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title="정보"
      >
        <div className="max-h-[20rem] overflow-y-auto">
          {calendarInfo?.length > 0 ? (
            calendarInfo.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="mb-3 p-3 bg-gray-50 rounded-xl shadow-sm border hover:border-blue-300 cursor-pointer transition-all"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    등록일:{" "}
                    <span className="font-medium">{item.createdday}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    일정일:{" "}
                    <span className="font-medium">{item.scheduleday}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {item.phonenumber}
                    </span>
                    <pre className="flex-1 ">{item.content}</pre>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-600 w-[90%] text-right truncate cursor-pointer hover:text-blue-500">
              등록된 일정이 없습니다.
            </div>
          )}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={() => setIsInfoOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
      >
        <InputField
          label="휴대폰 번호"
          type="text"
          placeholder="휴대폰 번호"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e)}
        />
        <InputField
          label="내용"
          type="textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-4 text-right">
          <button
            onClick={() => requestAlter()}
            className="px-4 py-2 mr-2 rounded bg-blue-200 hover:bg-blue-300"
          >
            {calendarUpdateId ? "수정" : "추가"}
          </button>
          {calendarUpdateId && (
            <button
              onClick={() => requestDelete()}
              className="px-4 py-2 mr-2 rounded bg-red-200 hover:bg-red-300 text-red-600"
            >
              삭제
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </Modal>
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full bg-white py-3 px-8">
        <div className="flex justify-center items-center relative">
          <YearPickerModal
            currentDate={currentDate}
            onSelectYear={(newDate) => buildCalendarDate(newDate)}
            onClose={() => runYearPicker(false)}
            isOpen={showYearPicker}
          />
          <div className="flex justify-center items-center gap-3 select-none">
            <div
              className="cursor-pointer w-5 h-5"
              onClick={() => handleLeftRightClick("left")}
            >
              <ArrowLeft></ArrowLeft>
            </div>
            <div
              className="text-center text-2xl font-bold text-gray-800 py-4 cursor-pointer"
              onClick={() => runYearPicker(true)}
            >
              {currentDate.format("YYYY년 MM월")}
            </div>
            <div
              className="cursor-pointer w-5 h-5"
              onClick={() => handleLeftRightClick("right")}
            >
              <ArrowRight></ArrowRight>
            </div>
          </div>
        </div>
        <div className="w-full border rounded-2xl shadow-md">
          <div className="grid grid-cols-7 text-center font-semibold text-gray-700">
            {DAT_OF_WEEK_KOR.map((day: string, index: number) => {
              const isLastColumn = index < 7 && index != 0;
              return (
                <div
                  key={day}
                  className={`py-4 border-gray-200
                    ${isLastColumn ? "border-l" : ""}
                    `}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7">
            {calendarArray.map((day: calendarType, index: number) => {
              const isToday = day.today;
              const isCurrentMonth = day.type == "current";
              const isLastRow =
                Math.floor(index / 7) ===
                Math.floor((calendarArray.length - 1) / 7);
              const isFirstRow = Math.floor(index % 7) === 0;
              const isFirstColumn = index < 7;
              return (
                <div
                  key={day.stringFormat}
                  className={`
                py-1 border-gray-200 flex flex-col min-h-24
                ${isFirstColumn ? "border-t" : ""}
                ${isLastRow ? "" : "border-b"}
                ${isToday ? "text-blue-400" : ""}
                ${isFirstRow ? "" : "border-l"}
                ${!isCurrentMonth ? "text-gray-300" : "text-gray-800"}
                hover:bg-blue-50
              `}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="pl-1 cursor-pointer hover:text-blue-500 "
                      onClick={() => runInfoModal(day)}
                    >
                      {day.dayString}
                    </div>
                    <div
                      className="pr-1 text-blue-400 text-xl font-bold cursor-pointer"
                      onClick={() => runModal(day)}
                    >
                      +
                    </div>
                  </div>
                  <div className="pr-1 flex-1 flex flex-col items-end justify-start">
                    {/* 나중에 아이템들이 위치할 장소 */}
                    {day.option?.map &&
                      day?.option?.map((item: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`text-sm text-gray-600 w-[90%] text-right truncate cursor-pointer hover:text-blue-500 ${!isCurrentMonth ? "text-gray-200" : "text-gray-800"}`}
                            onClick={() => runModalForUpdate(day, item)}
                          >{`${item.phonenumber} : ${item.content}`}</div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarComponent;
