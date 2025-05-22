"use client";
import Link from "next/link";
import React from "react";
import DarkModeBtn from "./DarkModeBtn";
import { Session } from "next-auth";
import { useUserService } from "../ddd/actions";
import { signOut } from "next-auth/react";

interface HeaderProps {
  session: Session;
}
/**
 * URL을 2뎁스로 main 디렉토리 같은거 만들어서 공통 레이아웃에 넣으면 더 좋은데 여기선 그냥..
 * @returns {JSX.Element}
 */
const Header = ({ session }: HeaderProps) => {
  const isSuperUser =
    session?.user?.auths && session?.user?.auths?.includes("admin");
  const logOut = async () => {
    await useUserService.logOut(session?.user?.username);
    await signOut({ redirect: true, callbackUrl: "/" });
  };
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
    </header>
  );
};

export default Header;
