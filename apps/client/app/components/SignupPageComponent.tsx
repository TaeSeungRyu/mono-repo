"use client";

import React, { useState } from "react";
import InputField from "./InputComponent";
import { useUserService } from "../ddd/actions";
import { useRouter } from "next/navigation";

const SignupPageComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validResult = useUserService.validateDataBeforInsert(
      username,
      password,
      name
    );
    if (!validResult.result) {
      alert(validResult.message);
      return;
    }
    if (!confirm("회원가입 하시겠습니까?")) return;
    const result = await useUserService.signUp(username, password, name); //나중에 응답 타입에 대한 정의는 필수!
    if (result.status === 200) {
      alert("회원가입이 완료되었습니다.");
    } else {
      alert("회원가입에 실패하였습니다.");
    }
  };

  const testMe = () => {
    fetch("/api/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <div onClick={testMe}>test call api</div>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            회원가입
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <InputField
              label="이름"
              type="text"
              placeholder="이름을 입력하여 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPageComponent;
