// components/YearPickerModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Dayjs } from "dayjs";

interface YearPickerModalProps {
  currentDate: Dayjs;
  onSelectYear: (newDate: Dayjs) => void;
  onClose: () => void;
  isOpen: boolean;
}

const YearPickerModal = ({
  currentDate,
  onSelectYear,
  onClose,
  isOpen,
}: YearPickerModalProps) => {
  const [show, setShow] = useState(false);
  // 모달 mount → 애니메이션용 show 상태 설정
  useEffect(() => {
    if (isOpen)
      setTimeout(() => setShow(true), 10); // transition-trigger
    else setShow(false);
  }, [isOpen]);
  // 애니메이션 후 언마운트
  if (!isOpen && !show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          show ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div className="absolute top-10 left-[50%] translate-x-[-50%] w-80 h-80 bg-white border shadow-md rounded-2xl z-1">
        <div className="flex items-center justify-center py-3 font-semibold border-b">
          년도 변경
        </div>
        <div className="grid grid-cols-3 gap-2 p-4 max-h-64 overflow-y-auto">
          {Array.from({ length: 21 }, (_, i) => {
            const year = currentDate.year() - 10 + i;
            return (
              <button
                key={year}
                onClick={() => {
                  onSelectYear(currentDate.year(year));
                  onClose();
                }}
                className={`py-2 rounded text-sm font-medium transition-all
                  ${
                    year === currentDate.year()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {year}년
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearPickerModal;
