"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeBtn() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("");

  const toggleDarkMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme) setCurrentTheme(theme);
  }, [theme]);

  return (
    <>
      <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded"
      >
        {currentTheme}
      </button>
    </>
  );
}
