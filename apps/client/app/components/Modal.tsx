import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
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
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          show ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 모달 내용 */}
      <div
        className={`relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 transition-all duration-300 transform
          ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
