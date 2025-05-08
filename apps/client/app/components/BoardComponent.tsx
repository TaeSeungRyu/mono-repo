"use client";
import { useContext } from "react";
import React, { useEffect, useState } from "react";
import { LoginContext } from "./LoginContextProvider";
import { useQuery } from "@tanstack/react-query";
import { useBoardService } from "../ddd/actions";

const BoardComponent = () => {
  const [me, setMe] = useState<any>({ username: "", name: "" });
  const { loginData }: any = useContext(LoginContext);

  useEffect(() => {
    if (loginData?.data?.username) {
      setMe(loginData.data);
    }
  }, [loginData.data]);

  console.log(me);
  return (
    <>
      <div>기본 내 정보 : {me.username}</div>
      <div>기본 내 이름 : {me.name}</div>
    </>
  );
};

export default BoardComponent;
