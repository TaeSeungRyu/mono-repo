"use client";

import { io, Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { API } from "../types/const";
import { useSession } from "next-auth/react";

type Message = {
  type: "sent" | "received";
  content: string;
};

const WebsocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.user?.serverAccessToken) return;

    const socket = io(`${API.DIRECT_SERVER_WEBSOCKET}`, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
      withCredentials: true,
      query: {
        Authorization: `${session.user.serverAccessToken}`,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setTransport("N/A");
    });

    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, { type: "received", content: msg }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.serverAccessToken]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current) return;
    socketRef.current.emit("message", inputMessage);
    setMessages((prev) => [...prev, { type: "sent", content: inputMessage }]);
    setInputMessage("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 bg-white rounded-xl shadow-md">
      <div>
        <p className="text-sm">
          <strong>Status:</strong>{" "}
          <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "connected" : "disconnected"}
          </span>
        </p>
        <p className="text-sm">
          <strong>Transport:</strong> {transport}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="border p-2 rounded h-48 overflow-y-auto bg-gray-50 flex flex-col gap-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm px-3 py-1 max-w-[80%] rounded ${
                msg.type === "sent"
                  ? "bg-blue-100 self-start text-left"
                  : "bg-gray-200 self-end text-right"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsocketComponent;
