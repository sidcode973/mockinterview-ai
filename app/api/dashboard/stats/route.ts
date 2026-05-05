import { getInterviewStats } from "@/backend/controllers/interview-controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await getInterviewStats(request);

  if ("error" in res) {
    return NextResponse.json(
      { error: { message: res.error.message } },
      { status: res.error.statusCode }
    );
  }

  return NextResponse.json({ data: res });
}