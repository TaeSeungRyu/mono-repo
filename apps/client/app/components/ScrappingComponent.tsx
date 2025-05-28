"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useScrappingService } from "../ddd/actions";

const queryKey = "scrappingComponent";

const ScrappingComponent = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 1;
  const { data: scrappingData = {}, isLoading } = useQuery({
    queryKey: [queryKey, page],
    queryFn: async ({ queryKey }) => {
      const [_, page] = queryKey;
      const { data }: any = await useScrappingService.findWithPage(
        Number(page),
        limit,
      );
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: true,
  });

  useEffect(() => {
    if (scrappingData?.data && scrappingData.totalPage) {
      console.log("scrappingData");
      setTotalPage(scrappingData.totalPage);
    }
  }, [scrappingData]);

  const movePage = (isPlus: boolean) => {
    if (isPlus) {
      if (page >= totalPage) return;
      setPage((prev) => prev + 1);
    } else {
      if (page <= 1) return;
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">스크래핑 결과</h2>
      <div className="p-4 bg-white rounded-lg shadow-md h-[70vh] overflow-y-auto">
        {isLoading && <p>로딩 중...</p>}
        {scrappingData?.data && scrappingData.data.length > 0 && (
          <div
            dangerouslySetInnerHTML={{
              __html: scrappingData?.data[0]?.contents,
            }}
          />
        )}
      </div>
      {/* 페이지 네비게이션 */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => movePage(false)}
          disabled={page <= 1}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            page <= 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          ← 이전
        </button>

        <span className="text-gray-700 font-semibold">
          {page} / {totalPage}
        </span>

        <button
          onClick={() => movePage(true)}
          disabled={page >= totalPage}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            page >= totalPage
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          다음 →
        </button>
      </div>
    </>
  );
};

export default ScrappingComponent;
