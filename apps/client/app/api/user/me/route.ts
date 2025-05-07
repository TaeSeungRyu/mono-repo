import { NextRequest, NextResponse } from "next/server";
import { CommonResponse } from "@/app/ddd/domain/CommonResponse";
import { getToken, decode } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const tokens = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true, // JWT 토큰을 직접 처리
      cookieName: "next-auth.session-token",
    });
    const savedValue = await decode({
      token: tokens,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    // 추가적으로 필요한 정보가 있을 경우, 여기서 처리
    if (savedValue) {
      return NextResponse.json({ success: true, data: savedValue });
    } else {
      return NextResponse.json({
        success: false,
        error: "No session found",
      });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new CommonResponse({
        success: false,
        error: "Internal server error",
        details: error.message,
      })
    );
  }
}
