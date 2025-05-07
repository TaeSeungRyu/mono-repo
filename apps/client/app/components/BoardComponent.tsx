"use client";
import { useContext } from "react";
import React, { useEffect, useState } from "react";
import { LoginContext } from "./LoginContextProvider";
import { useQuery } from "@tanstack/react-query";
import { useBoardService } from "../ddd/actions";
import { useRouter } from "next/navigation";

const BoardComponent = () => {
  const router = useRouter();

  const [me, setMe] = useState<any>({ username: "", name: "" });
  const { loginData }: any = useContext(LoginContext);
  const [cashedList, setCashedList] = useState<any>([]);

  const { data } = useQuery({
    queryKey: ["board"],
    queryFn: async () => {
      const data = await useBoardService.selectCashedDataAll();
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    gcTime: 1000 * 60 * 60, // 1시간 후에 캐시 삭제
  });

  useEffect(() => {
    if (loginData.username) {
      setMe(loginData);
    }
    setCashedList(data);
    console.log("data", data);
  }, [loginData, data]);

  const goTestPage = () => {
    router.push("/test");
  };

  return (
    <>
      <div>기본 내 정보 : {me.username}</div>
      <div>기본 내 이름 : {me.name}</div>
      <div>캐시된 데이터</div>
      <ul>
        {cashedList?.data?.map((item: any, index: number) => (
          <li key={index}>
            {item.title} {item.description}
          </li>
        ))}
      </ul>

      <button onClick={goTestPage}>move test page</button>
    </>
  );
};

export default BoardComponent;
