"use client";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { calculateDay, calendarType, DAT_OF_WEEK_KOR } from "./ComponentUtil";
import ArrowLeft from "../../public/left-arrow.svg";
import ArrowRight from "../../public/right-arrow.svg";
import Modal from "./Modal";
import YearPickerModal from "./YearPickerModal"; // ← 경로는 파일 위치에 따라 조정
import InputField from "./InputComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCalendarService } from "../ddd/actions";

const queryKey = "calendarList";

const CalendarComponent = () => {
  const [calendarArray, setCalendarData] = useState<Array<calendarType>>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    buildCalendarDate();
  }, []);

  useEffect(() => {
    if (calendarArray.length == 0) return;
    const _currentDayInMonth = calendarArray.find(
      (day: calendarType) => day.type == "current",
    );
    setCurrentDate(_currentDayInMonth?.date || dayjs());
  }, [calendarArray]);

  const buildCalendarDate = (day: Dayjs = dayjs()) => {
    setCalendarData(calculateDay(day, (dayArray: any) => {}));
  };

  const handleLeftRightClick = (direction: string) => {
    const newDate =
      direction === "left"
        ? currentDate.subtract(1, "month").startOf("month")
        : currentDate.add(1, "month").startOf("month");
    refetch();
    buildCalendarDate(newDate);
  };

  const runModal = (day: calendarType) => {
    const dayDate = day.date.format("YYYY년 MM월 DD일");
    setSelectedDate(day.date);
    const dayOfWeekKor = day.dayOfWeekKor;
    setModalTitle(`${dayDate} (${dayOfWeekKor}요일)`);
    setIsOpen(true);
  };

  const runYearPicker = (arg: boolean) => {
    setShowYearPicker(arg);
  };

  //데이터 CURD 부분 -----
  const { data: calednarList = [], refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data }: any = await useCalendarService.selectByScheduleday(
        calendarArray[0].stringFormat,
        calendarArray[calendarArray.length - 1].stringFormat,
      );
      return data;
    },
    enabled: true,
  });
  const requestInsert = () => {
    if (!phoneNumber || !content) {
      alert("휴대폰 번호와 내용을 입력해주세요.");
      return;
    }
    if (!confirm("정말로 추가하시겠습니까?")) return;
    insertMutation.mutate();
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
    },
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
      >
        <p>-- 입력 -- </p>
        <InputField
          label="휴대폰 번호"
          type="text"
          placeholder="휴대폰 번호"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={() => requestInsert()}
            className="px-4 py-2 mr-2 rounded bg-blue-200 hover:bg-blue-300"
          >
            추가
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </Modal>

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
                  key={index}
                  className={`
                py-1 border-gray-200 flex flex-col min-h-24
                ${isFirstColumn ? "border-t" : ""}
                ${isLastRow ? "" : "border-b"}
                ${isToday ? "text-blue-400" : ""}
                ${isFirstRow ? "" : "border-l"}
                ${!isCurrentMonth ? "text-gray-300" : "text-gray-800"}
                hover:bg-blue-50 cursor-pointer
              `}
                  onClick={() => runModal(day)}
                >
                  <div className="pl-1 ">{day.dayString}</div>
                  <div className="pr-1 flex-1 flex flex-col items-end justify-start">
                    {/* 나중에 아이템들이 위치할 장소 */}
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
