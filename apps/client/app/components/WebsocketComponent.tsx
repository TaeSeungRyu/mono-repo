"use client";

import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { API } from "../types/const";
import { useSession } from "next-auth/react";
import { authOptions } from "../utils/authOptions";

const WebsocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const { data: session } = useSession();
  const socket = io(
    "ws://localhost:8081/websocket", // 서버 주소 "ws://localhost:8081/websocket"
    {
      autoConnect: false, // 자동 연결
      reconnection: false, // 재연결 허용
      transports: ["websocket"], // 사용할 전송 방식
      withCredentials: true, // 자격 증명 허용
      extraHeaders: {
        Authorization: `Bearer ${session?.user?.serverAccessToken}`, // 인증 헤더 추가
      },
    },
  );

  useEffect(() => {
    if (session?.user?.serverAccessToken) {
      socket.connect();
    }
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    socket.on("connect", onConnect);
    socket.on("connection", (socket) => {
      console.log("header :::: ", socket.handshake.headers); // an object containing "my-custom-header": "1234"
    });
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [session?.user?.serverAccessToken]);

  return (
    <>
      {" "}
      <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>
    </>
  );
};

export default WebsocketComponent;
