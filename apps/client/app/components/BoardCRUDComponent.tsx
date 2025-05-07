"use client";

import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InputField from "./InputComponent";
import { LoginContext } from "./LoginContextProvider";
import { useBoardService } from "../ddd/actions";
import { Board } from "../ddd/domain/board/Repo";

const BoardQueryKey = "boardList";

const BoardCRUDComponent = () => {
  const { loginData }: any = useContext(LoginContext);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  // ✅ 게시글 목록 불러오기 (useQuery 사용)
  const { data: boardList = [], refetch } = useQuery({
    queryKey: [BoardQueryKey],
    queryFn: async () => {
      const { data }: any = await useBoardService.selectDataAll();
      return data;
    },
  });

  // ✅ 삽입 (useMutation 사용)
  const insertMutation = useMutation({
    mutationFn: async () => {
      await useBoardService.insertData({
        title,
        contents,
        username: loginData.username,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BoardQueryKey] });
      setTitle(""); // 입력 필드 초기화
      setContents("");
    },
  });

  // ✅ 수정 (useMutation 사용)
  const updateMutation = useMutation({
    mutationFn: async (item: Board) => {
      await useBoardService.updateData(item);
    },
    onMutate: () => {
      // 낙관적 업데이트: 데이터가 등록되기 전에 화면을 먼저 업데이트
      queryClient.setQueryData([BoardQueryKey], (oldData: any) => [
        ...oldData,
        { title, contents, username: loginData.username, idx: Date.now() }, // 임시 데이터 추가
      ]);
    },
    onError: (error, variables, context) => {
      // 실패 시 롤백: 화면에 반영한 데이터를 취소
      console.error("등록 실패", error);
      queryClient.invalidateQueries({ queryKey: [BoardQueryKey] });
    },
    onSuccess: () => {
      // 성공 시 데이터를 다시 불러와서 최신 상태로 유지
      refetch();
    },
  });

  // ✅ 삭제 (useMutation 사용)
  const deleteMutation = useMutation({
    mutationFn: async (idx: number) => {
      await useBoardService.deleteData(idx);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BoardQueryKey] });
    },
  });

  const changeBoardItem = (
    key: keyof Board,
    item: Board,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    queryClient.setQueryData([BoardQueryKey], (prevList: Board[]) =>
      useBoardService.changeBoardItem(key, prevList, item, e)
    );
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg shadow-md w-1/2 mx-auto">
        <InputField
          label="제목"
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputField
          label="내용"
          type="textarea"
          placeholder="내용"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />
        <button
          className="px-2 py-1 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => insertMutation.mutate()}
          disabled={insertMutation.isPending}
        >
          {insertMutation.isPending ? "등록 중..." : "등록"}
        </button>
      </div>

      <div className="overflow-x-auto w-1/2 mx-auto mt-4">
        <h1 className="text-2xl font-semibold text-center">게시판</h1>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-1 text-left border-b border-gray-300">
                번호
              </th>
              <th className="px-4 py-1 text-left border-b border-gray-300">
                제목
              </th>
              <th className="px-4 py-1 text-left border-b border-gray-300">
                내용
              </th>
              <th className="px-4 py-1 text-left border-b border-gray-300">
                작성자
              </th>
              <th className="px-4 py-1 text-left border-b border-gray-300">
                수정/삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((item: Board, index: number) => (
              <tr className="hover:bg-gray-100" key={index}>
                <td className="px-4 py-1 border-b border-gray-300">
                  {item.idx}
                </td>
                <td className="px-4 py-1 border-b border-gray-300">
                  <InputField
                    label="제목"
                    type="text"
                    value={item.title}
                    onChange={(e) => changeBoardItem("title", item, e)}
                  />
                </td>
                <td className="px-4 py-1 border-b border-gray-300">
                  <InputField
                    label="내용"
                    type="textarea"
                    value={item.contents}
                    onChange={(e) => changeBoardItem("contents", item, e)}
                  />
                </td>
                <td className="px-4 py-1 border-b border-gray-300">
                  {item.username}
                </td>
                <td className="px-4 py-1 border-b border-gray-300 space-x-2">
                  <button
                    className="px-2 py-1 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    onClick={() => updateMutation.mutate(item)}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "수정 중..." : "수정"}
                  </button>
                  <button
                    className="px-2 py-1 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                    onClick={() =>
                      item.idx !== null && deleteMutation.mutate(item.idx)
                    }
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoardCRUDComponent;
