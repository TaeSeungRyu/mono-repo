import Link from "next/link";
import React, { useEffect, useState } from "react";
import DarkModeBtn from "./DarkModeBtn";

/**
 * URL을 2뎁스로 main 디렉토리 같은거 만들어서 공통 레이아웃에 넣으면 더 좋은데 여기선 그냥..
 * @returns {JSX.Element}
 */
const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            mono repo app
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
              href="/user"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              user
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
