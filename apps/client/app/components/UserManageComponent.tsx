"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useUserService } from "../ddd/actions";
import Modal from "./Modal";
import InputField from "./InputComponent";
import { useAuthCodesData } from "../user/providers";
const queryKey = "userListData";

const UserManageComponent = () => {
  const queryClient = useQueryClient();
  const [isReadonly, setIsReadonly] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [userUpdateId, setUserUpdateId] = useState<string>("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isPasswordEqual, setIsPasswordEqual] = useState(true);
  const [myName, setMyName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const limit = 3;
  const codeFromLayout = useAuthCodesData && useAuthCodesData();

  const {
    data: userList = {},
    refetch,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [queryKey, page],
    queryFn: async ({ queryKey }) => {
      const [_, page] = queryKey;
      const { data }: any = await useUserService.findUserWithPage(
        Number(page),
        limit,
        null,
        null,
      );
      return data;
    },
    placeholderData: (prev) => prev,
    enabled: true,
  });

  useEffect(() => {}, [codeFromLayout]);

  useEffect(() => {
    if (userList && userList.totalPage) {
      setTotalPage(userList.totalPage);
    }
  }, [userList]);

  const movePage = (isPlus: boolean) => {
    if (isPlus) {
      if (page >= totalPage) return;
      setPage((prev) => prev + 1);
    } else {
      if (page <= 1) return;
      setPage((prev) => prev - 1);
    }
  };

  const runInfoModal = (user?: any) => {
    if (user) {
      setMyName(user.name);
      setUsername(user.username);
      setUserUpdateId(user.id);
      setIsReadonly(true);
    } else {
      setMyName("");
      setUsername("");
      setUserUpdateId("");
      setIsReadonly(false);
    }
    setOldPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setIsPasswordEqual(true);
    setIsOpen(true);
  };

  const requestAlter = async () => {
    if (!isPasswordEqual) return;
    if (userUpdateId) {
      if (oldPassword == "") {
        alert("기존 비밀번호를 입력해주세요");
        return;
      }
      if (!confirm("정말로 수정 하시겠습니까?")) return;
      updateMutation.mutate();
    } else {
      if (username == "") {
        alert("아이디를 입력해주세요");
        return;
      }
      if (myName == "") {
        alert("이름을 입력해주세요");
        return;
      }
      if (newPassword == "") {
        alert("비밀번호를 입력해주세요");
        return;
      }
      if (!confirm("정말로 추가 하시겠습니까?")) return;
      insertMutation.mutate();
    }
  };
  const requestDelete = async () => {
    if (oldPassword == "") {
      alert("기존 비밀번호를 입력해주세요");
      return;
    }
    if (!confirm("정말로 삭제 하시겠습니까?")) return;
    deleteMutation.mutate();
  };

  useEffect(() => {
    if (newPassword.length == 0 && newPasswordConfirm.length == 0) {
      setIsPasswordEqual(true);
    } else if (newPassword || newPasswordConfirm) {
      setIsPasswordEqual(newPassword === newPasswordConfirm);
    }
  }, [newPassword, newPasswordConfirm]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const result = await useUserService.updateData(
        userUpdateId,
        oldPassword,
        newPassword,
        myName,
      );
      return result;
    },
    onSuccess: (arg) => {
      if (arg.success) {
        alert("수정 성공");
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } else {
        alert("수정 실패\n 비밀번호 확인 요망");
      }
    },
    onError: (error) => {
      alert("수정 실패");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await useUserService.deleteData(userUpdateId, oldPassword);
      return result;
    },
    onSuccess: (arg) => {
      if (arg.success) {
        alert("삭제 성공");
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } else {
        alert("삭제 실패\n 비밀번호 확인 요망");
      }
    },
    onError: (error) => {
      alert("삭제 실패");
      console.error(error);
    },
  });

  const insertMutation = useMutation({
    mutationFn: async () => {
      const result = await useUserService.signUp(username, newPassword, myName);
      return result;
    },
    onSuccess: (arg) => {
      if (arg.success) {
        alert("추가 성공");
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } else {
        alert("추가 실패");
      }
    },
    onError: (error) => {
      alert("삭제 실패");
      console.error(error);
    },
  });

  return (
    <div className="w-[50%] mx-auto p-6 bg-white shadow-lg rounded-2xl dark:bg-gray-800 dark:text-white">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="사용자">
        <form className="flex flex-col space-y-4">
          <InputField
            label="아이디"
            type="text"
            placeholder="사용자 아이디"
            value={username}
            readonly={isReadonly}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            label="이름"
            type="text"
            placeholder="이름"
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
          />
          {userUpdateId && (
            <InputField
              label="기존 비밀번호"
              type="password"
              placeholder="기존 비밀번호"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          )}
          {codeFromLayout && codeFromLayout?.result?.data?.length > 0 && (
            <div className="flex flex-col justify-center">
              <div>권한</div>
              <select
                className="border rounded p-2"
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              >
                {codeFromLayout.result.data.map((option: any) => (
                  <option key={option.authcode} value={option.authname}>
                    {option.authname}
                  </option>
                ))}
              </select>
            </div>
          )}

          <InputField
            label="신규 비밀번호"
            type="password"
            placeholder="신규 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            label="신규 비밀번호 확인"
            type="password"
            placeholder="신규 비밀번호 확인"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          {!isPasswordEqual && (
            <p className="text-red-500 text-sm">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </form>
        <div className="mt-4 text-right">
          <button
            onClick={() => requestAlter()}
            className="px-4 py-2 mr-2 rounded bg-blue-200 hover:bg-blue-300"
          >
            {userUpdateId ? "수정" : "추가"}
          </button>
          {userUpdateId && (
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

      <h1 className="text-2xl font-bold mb-6 text-center">👥 유저 관리</h1>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={() => runInfoModal()}
      >
        사용자 추가
      </button>

      {isLoading && <p className="text-center text-gray-500">로딩 중...</p>}

      {isSuccess && (
        <ul className="space-y-4">
          {userList.data.map((user: any) => (
            <li
              key={user.username}
              className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition cursor-pointer"
              onClick={() => {
                runInfoModal(user);
              }}
            >
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </li>
          ))}
        </ul>
      )}

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
    </div>
  );
};

export default UserManageComponent;
