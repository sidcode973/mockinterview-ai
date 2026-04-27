import { getInterviews } from "@/backend/controllers/interview-controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await getInterviews(request);

  const interviews = "interviews" in res ? res.interviews : [];

  return NextResponse.json({ interviews });
}
