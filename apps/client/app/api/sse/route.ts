// pages/api/sse.ts or app/api/sse/route.ts (Node.js용)

import { getToken, decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);

  try {
    const username = searchParams.get("username");
    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 },
      );
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
      cookieName: "next-auth.session-token",
    });

    const savedValue: any = await decode({
      token: token || "",
      secret: process.env.NEXTAUTH_SECRET || "",
    });

    const backendRes = await fetch(
      `${process.env.API_SERVER_URL}/events/sse/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${savedValue?.serverAccessToken}`,
          cookie: `refreshToken=${savedValue?.serverRefreshToken}`,
        },
      },
    );
    if (backendRes.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to backend SSE stream",
        },
        { status: 502 },
      );
    }
    return backendRes;
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
