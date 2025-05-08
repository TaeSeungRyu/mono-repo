"use client";

import React, { useEffect, useState } from "react";
import InputField from "./InputComponent";
import { useUserService } from "../ddd/actions";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const SigninPageComponent = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      signOut({ redirect: false });
      useUserService.alterLocalStorage(null, null);
    }
  }, []);
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin1234");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const singinResult = await useUserService.signIn(username, password);
    if (singinResult.status === 200) {
      router.push("/board");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
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
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
