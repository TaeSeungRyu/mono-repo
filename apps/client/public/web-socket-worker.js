let socket = null; // Web Worker 전역 범위에서 socket 선언
let userId = null;
self.onmessage = async function (event) {
  const { type, data } = event.data; // type(작업 종류), data(메시지)

  if (type === "open") {
    if (socket) {
      socket.close(); // 기존 소켓이 열려 있다면 닫기
    }
    await fetch("/api/ws");
    socket = new WebSocket(`ws://localhost:3001`);

    socket.onopen = function () {
      self.postMessage({ type: "open", data: "WebSocket 연결 성공" });
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "id") {
        userId = data.id;
        self.postMessage({ type: "message", data: JSON.parse(event.data) });
      } else if (data?.type === "private" || data?.type === "broadcast") {
        self.postMessage({ type: "message", data: JSON.parse(event.data) });
      }
    };

    socket.onerror = function (error) {
      self.postMessage({ type: "error", data: error.message });
    };

    socket.onclose = function () {
      self.postMessage({ type: "close", data: "WebSocket 연결 종료" });
      socket = null; // 소켓이 닫히면 변수 초기화
    };
  } else if (type === "close") {
    if (socket) {
      socket.close();
      socket = null;
    }
  } else if (type === "send") {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageData = {
        type: "broadcast",
        from: userId,
        message: JSON.stringify(data),
      };
      socket.send(JSON.stringify(messageData)); // JSON 데이터 전송
    } else {
      self.postMessage({ type: "error", data: "WebSocket이 열려있지 않음" });
    }
  }
};
