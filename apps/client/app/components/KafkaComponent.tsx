"use client";

import React, { useEffect, useState } from "react";
import InputField from "./InputComponent";
import { useMutation } from "@tanstack/react-query";
import { useKafkaService } from "../ddd/actions";

const KafkaComponent = () => {
  const [content, setContent] = useState("");
  // ✅ 삽입 (useMutation 사용)
  const insertMutation = useMutation({
    mutationFn: async () => {
      if (!content.trim()) {
        alert("내용을 입력하세요.");
        throw new Error("내용을 입력하세요."); //에러를 발생해야 입력 전 상태를 기억함! 단순 return인 경우 초기화
      }
      if (!confirm("등록하시겠습니까?")) {
        throw new Error("stop");
      }
      await useKafkaService.add(content);
    },
    onSuccess: () => {
      setContent("");
    },
  });
  return (
    <>
      <div className="text-2xl font-bold mb-4 text-center mt-3">
        kafka 메시지 전송
      </div>
      <div className="flex gap-4 p-4 bg-gray-100 rounded-lg shadow-md w-1/3  flex-col items-center">
        <InputField
          label="내용"
          type="textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
        <button
          className="px-2 py-1  text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => insertMutation.mutate()}
          disabled={insertMutation.isPending}
        >
          {insertMutation.isPending ? "등록 중..." : "등록"}
        </button>
      </div>
    </>
  );
};

export default KafkaComponent;
