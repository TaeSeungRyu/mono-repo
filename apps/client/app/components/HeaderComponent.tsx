"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DarkModeBtn from "./DarkModeBtn";
import { Session } from "next-auth";
import { useUserService } from "../ddd/actions";
import { signOut } from "next-auth/react";
import { API } from "../types/const";

interface HeaderProps {
  session: Session;
}
/**
 * URL을 2뎁스로 main 디렉토리 같은거 만들어서 공통 레이아웃에 넣으면 더 좋은데 여기선 그냥..
 * @returns {JSX.Element}
 */
const Header = ({ session }: HeaderProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  const isSuperUser =
    session?.user?.auths && session?.user?.auths?.includes("admin");
  const logOut = async () => {
    await useUserService.logOut(session?.user?.username);
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  useEffect(() => {
    const eventSource = new EventSource(
      `${API.LOCAL_SSE}?username=${session?.user?.username}`,
    );
    eventSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed?.event !== "ping") {
        setMessages((prev) => [
          ...prev,
          `(${parsed?.event}) ${parsed?.data?.data?.user?.username}이 ${parsed?.data?.data?.createdday}에 ${parsed?.data?.data?.content}을 작성`,
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          `(${parsed?.event}) 서버가 연결을 유지하고 있습니다.`,
        ]);
      }
    };
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      //401 또는 403 에러가 발생하면 리프레시
      if (err instanceof Event && (err.target as any).readyState === 2) {
        // readyState 2는 CLOSED 상태
        console.error("SSE connection closed, attempting to reconnect...");
        // 여기서 리프레시 로직을 추가할 수 있습니다.
        if (session?.user?.username) {
        }
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            리엑트앱(모노레포!)
            <DarkModeBtn></DarkModeBtn>
          </div>
          <nav className="flex space-x-6">
            <Link
              href="/board"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              board
            </Link>
            <Link
              href="/calendar"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              calendar
            </Link>
            <Link
              href="/scrapping"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              scrapping
            </Link>
            <Link
              href="/github"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              git
            </Link>
            <Link
              href="/kafka"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              kafka
            </Link>
            <Link
              href="/websocket"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              websocket
            </Link>
            {isSuperUser && (
              <Link
                href="/user"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                user
              </Link>
            )}
            <button onClick={() => logOut()}>logOut</button>
          </nav>
        </div>
      </div>
      <div className="flex items-center space-x-4 absolute right-0 top-0 mt-2 mr-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {messages.length > 0
            ? messages.map((msg, index) => (
                <div key={index} className="mb-1">
                  {msg}
                </div>
              ))
            : "No messages"}
        </span>
      </div>
    </header>
  );
};

export default Header;
