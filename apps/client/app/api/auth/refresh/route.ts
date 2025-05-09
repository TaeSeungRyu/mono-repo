import { NextRequest, NextResponse } from "next/server";
import { CommonResponse } from "@/app/ddd/domain/CommonResponse";
import { getToken, decode, encode } from "next-auth/jwt";
import { API } from "@/app/types/const";

export async function GET(request: NextRequest) {
  try {
    //자신의 토큰을 가지고 옴
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
      cookieName: "next-auth.session-token",
    });

    //토큰 디코딩
    const savedValue: any = await decode({
      token: token,
      secret: process.env.NEXTAUTH_SECRET || "",
    });

    //api 서버에게 refreshToken을 보내서 accessToken을 받아옴
    const refreshResult = await fetch(
      `${process.env.API_SERVER_URL}${API.DIRECT_SERVER_REFRESH}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedValue?.serverAccessToken}`,
          cookie: `refreshToken=${savedValue?.serverRefreshToken}`,
        },
      },
    );

    //응답 결과를 반환함
    const { result } = await refreshResult.json();
    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: result?.accessToken,
        refreshToken: savedValue?.serverRefreshToken,
      },
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
