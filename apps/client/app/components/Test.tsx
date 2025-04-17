"use client";

export default function Test() {
  const gogogo = () => {
    fetch("http://localhost:3000/api-server/login/permission", {
      //API 서버에 로그인 요청
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => {
      console.log(e);
    });
  };
  return (
    <>
      <button onClick={() => gogogo()}>gogogo</button>
    </>
  );
}
