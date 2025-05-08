import { NextRequest, NextResponse } from "next/server";
import { CommonResponse } from "@/app/ddd/domain/CommonResponse";
import { getToken, decode, encode } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true, // JWT 토큰을 직접 처리
      cookieName: "next-auth.session-token",
    });
    const savedValue: any = await decode({
      token: token,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    console.log("savedValue", savedValue);
    const refreshResult = await fetch(
      `${process.env.API_SERVER_URL}/auth/refresh-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: `refresh_token=${savedValue?.serverRefreshToken}`,
        },
      },
    );
    const { data } = await refreshResult.json();
    console.log("refreshResult", data);
    const response = NextResponse.json({
      success: true,
      data: data?.result?.access_token,
    });
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new CommonResponse({
        success: false,
        error: "Internal server error",
        details: error.message,
      }),
    );
  }
}
