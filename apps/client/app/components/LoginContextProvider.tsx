"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useUserService } from "../ddd/actions";

export const LoginContext = createContext({
  loginData: {},
  setLoginData: (data: string) => {},
});

const CONTEXT_KEY = "LoginContextProviderQueryKey";
type Props = { children: ReactNode };

export default function LoginContextProvider({ children }: Props) {
  const [loginData, setLoginData] = useState({});

  const { isLoading, isError, refetch } = useQuery({
    queryKey: [CONTEXT_KEY],
    queryFn: async () => {
      const storedData = useUserService.getLocalStorage;
      if (!storedData) {
        const { data } = await useUserService.findMe();
        useUserService.alterLocalStorage(data, () => {
          setLoginData(data);
        });
      }
      return true;
    },
    enabled: true,
  });

  useEffect(() => {
    const storedData = useUserService.getLocalStorage;
    if (!storedData) {
      refetch();
    } else {
      setLoginData(storedData);
    }
  }, []);

  const updateLocalStorageData = (data: string) => {
    useUserService.alterLocalStorage(data, () => {
      setLoginData(data);
    });
  };
  return (
    <LoginContext.Provider
      value={{
        loginData,
        setLoginData: updateLocalStorageData,
      }}
    >
      {isLoading ? (
        <div>loading...</div>
      ) : isError ? (
        <div>error...</div>
      ) : (
        children
      )}
    </LoginContext.Provider>
  );
}
