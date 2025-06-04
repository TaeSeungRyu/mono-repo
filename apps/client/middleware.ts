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
    //console.log("savedValue?.serverAccessToken", savedValue?.serverAccessToken);
    headers.set("Authorization", `Bearer ${savedValue?.serverAccessToken}`); //여기에 Auth같은 헤더 추가를 하면 됩니다.
    headers.set("cookie", `refreshToken=${savedValue?.serverRefreshToken}`); //쿠키도 추가
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

  //console.log("requestPath :", requestPath);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  //console.log("response.status:", response.status, request.url);
  if (response.status == 401) {
    console.log("401 Unauthorized");
  }
  return response;
}

export const config = {
  matcher: ["/api-server/:path*", "/sample", "/board"],
};
