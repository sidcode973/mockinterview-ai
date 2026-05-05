import { getInterviewById } from "@/backend/controllers/interview-controller";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await getInterviewById(id);

  if ("error" in res) {
    return NextResponse.json(
      {
        error: { message: res.error?.message },
      },
      { status: res.error?.statusCode }
    );
  }

  if ("interview" in res) {
    return NextResponse.json({ interview: res.interview });
  }

  return NextResponse.json({ interview: null });
}