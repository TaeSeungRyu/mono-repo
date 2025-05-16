"use client";
import React from "react";

type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  readonly?: boolean;
  onChange: (e: any) => void;
  className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  readonly = false,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readonly}
          className={`w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none 
            ${readonly ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed" : "dark:text-white"}`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readonly}
          className={`w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none 
            ${readonly ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed" : "dark:text-white"}`}
          autoComplete="off"
        />
      )}
    </div>
  );
};

export default InputField;
