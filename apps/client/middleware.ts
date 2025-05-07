import { getToken, decode } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

const _addAuthHeader = async (request: NextRequest, headers: Headers) => {
  try {
    const tokens = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true, // JWT 토큰을 직접 처리
      cookieName: "next-auth.session-token",
    });
    if (!tokens) {
      return;
    }
    const savedValue = await decode({
      token: tokens,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    headers.set("Authorization", `Bearer ${savedValue?.accessToken}`); //여기에 Auth같은 헤더 추가를 하면 됩니다.
  } catch (e) {
    console.log(e);
  }
};

export async function middleware(request: NextRequest) {
  //이 곳에서 저장된 키 값을 헤더에 넣어서 API 서버로 전달
  const requestPath = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  //console.log("requestPath", requestPath);

  if (requestPath.includes("api-server")) {
    await _addAuthHeader(request, requestHeaders);
  }
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-hello-from-middleware2", "hello"); //응답 헤더 변경 가능
  return response;
}

export const config = {
  matcher: ["/api-server/:path*", "/sample", "/board"],
};
