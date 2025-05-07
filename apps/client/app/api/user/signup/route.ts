import { CommonResponse } from "@/app/ddd/domain/CommonResponse";
import SqlLiteDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json();
    const insert = SqlLiteDB.prepare(
      "INSERT INTO User (username, password, name) VALUES ($username, $password, $name)"
    );
    const insertResult = insert.run({
      username,
      password,
      name,
    });
    return NextResponse.json(new CommonResponse(insertResult));
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new CommonResponse({
        error: "Internal server error",
        details: error.message,
      })
    );
  }
}
