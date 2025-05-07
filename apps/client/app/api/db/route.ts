import SqlLiteDB from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const queryResult = SqlLiteDB.prepare("SELECT * FROM User").all();
    return NextResponse.json({ data: queryResult }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { random_number, random_text } = await req.json();
    const insert = SqlLiteDB.prepare(
      "INSERT INTO User (random_number, random_text) VALUES ($random_number, $random_text)"
    );
    const insertResult = insert.run({
      random_number: random_number,
      random_text: random_text,
    });

    return NextResponse.json({ result: insertResult }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
