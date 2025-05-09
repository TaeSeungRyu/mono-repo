"use client";

import React, { useEffect, useState } from "react";
import InputField from "./InputComponent";
import { useUserService } from "../ddd/actions";
import { useRouter } from "next/navigation";
import { signOut, getCsrfToken } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";

const SigninPageComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin1234");
  const [csrfToken, setCsrfToken] = useState<string | undefined>();

  useEffect(() => {
    signOut({ redirect: false });
    useUserService.alterLocalStorage(null, null);
    if (!csrfToken) {
      getCsrfToken().then((token) => {
        setCsrfToken(token);
      });
    }
  }, []);

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async () => {
      const singinResult = await useUserService.signIn(username, password);
      return singinResult;
    },
    onSuccess: (singinResult) => {
      if (singinResult.status === 200) {
        router.push("/board");
      } else {
        alert("로그인 실패");
      }
    },
    onError: (error, variables, context) => {
      // 실패 시 롤백: 화면에 반영한 데이터를 취소
      console.error("등록 실패", error);
      alert("로그인 실패");
    },
  });

  return (
    <>
      {isPending ? "조회중..." : ""}
      <form className="space-y-4">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <InputField
          label="아이디"
          type="text"
          placeholder="ID를 입력하여 주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          label="비밀번호"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => handleLogin()}
        >
          로그인
        </button>
      </form>
      <p className="text-sm text-center text-gray-600">
        계정이 없으신가요?{" "}
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </span>
      </p>
    </>
  );
};

export default SigninPageComponent;
