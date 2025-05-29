"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useGithubService } from "../ddd/actions";

const queryKey = "gitComponent";

const GitComponent = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: githubData = [], isLoading } = useQuery({
    queryKey: [queryKey, page],
    queryFn: async ({ queryKey }) => {
      const [_, page] = queryKey;
      const { data }: any = await useGithubService.findWithPage(
        Number(page),
        limit,
      );
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: true,
  });

  const movePage = (isPlus: boolean) => {
    if (isPlus) {
      setPage((prev) => prev + 1);
    } else {
      if (page <= 1) return;
      setPage((prev) => prev - 1);
    }
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = !githubData || githubData.length < limit;

  return (
    <>
      <h2 className="text-xl font-semibold my-4">깃허브 커밋 목록들</h2>
      <h2 className="text-xl font-semibold my-4">
        공개 키가 90일짜리라 90일 뒤에는 안됨..ㅋ
      </h2>
      <div className="p-4 bg-white shadow-md h-[70vh] overflow-y-auto w-full">
        {isLoading && <p>불러오는 중...</p>}
        {!isLoading && githubData.length === 0 && <p>커밋 내역이 없습니다.</p>}
        {githubData?.map((commit: any) => (
          <div
            className="p-2 mb-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200  cursor-pointer flex flex-col gap-1"
            key={commit.sha}
          >
            <div
              className="text-sm text-gray-500
             "
            >
              username : {commit.commit.author.name}
            </div>
            <div className="text-sm text-gray-500 my-1">
              {new Date(commit.commit.author.date).toLocaleString()}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              message : {commit.commit.message}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="mt-6 flex justify-between items-center gap-4">
        <button
          onClick={() => movePage(false)}
          disabled={isPrevDisabled}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            isPrevDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          ← 이전
        </button>

        <button
          onClick={() => movePage(true)}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded-lg transition font-medium ${
            isNextDisabled
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

export default GitComponent;
