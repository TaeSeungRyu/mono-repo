// lib/fetcher.ts
import { signIn } from "next-auth/react";

export async function fetcher(
  input: RequestInfo,
  init?: RequestInit,
  retry = true,
): Promise<any> {
  const response = await fetch(input, {
    ...init,
  });

  console.log("response.status response.status", response.status);
  if (response.status == 401) {
    //const { update } = useSession();
    // accessToken이 만료된 경우 → refresh 요청
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "get",
      credentials: "include", // 쿠키 전송
      headers: {},
    });

    const result = await refreshRes.json();

    console.log("refreshRes", result?.data?.access_token);
    console.log("refreshRes result", result?.data?.refresh_token);

    const ress: any = await signIn("credentials", {
      access_token: result?.data?.access_token,
      refresh_token: result?.data?.refresh_token,
      username: "",
      password: "",
      redirect: false,
    });
    debugger;
    if (refreshRes.ok) {
      // 새 토큰 갱신된 후 재요청 (단, 재시도는 1회만)
      return await fetcher(input, init, false);
    } else {
      // 로그아웃 처리 등
      throw new Error("세션이 만료되었습니다. 다시 로그인 해주세요.");
    }
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API 요청 실패");
  }

  return response;
}
