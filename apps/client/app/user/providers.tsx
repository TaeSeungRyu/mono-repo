// app/context/AuthCodesProvider.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
export const AuthCodesDataContext = createContext<any>(null);
export const useAuthCodesData = () => useContext(AuthCodesDataContext);

export function AuthCodesProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: any;
}) {
  return (
    <AuthCodesDataContext.Provider value={value}>
      {children}
    </AuthCodesDataContext.Provider>
  );
}
