import { NextRequest, NextResponse } from "next/server";
import { CommonResponse } from "@/app/ddd/domain/CommonResponse";
import { getToken, decode } from "next-auth/jwt";
import SqlLiteDB from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const queryResult = SqlLiteDB.prepare("SELECT * FROM CashedTable").all();
    if (queryResult) {
      return NextResponse.json(
        new CommonResponse({ success: true, data: queryResult })
      );
    } else {
      return NextResponse.json(new CommonResponse({ success: true, data: [] }));
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
