import { getAdminStats } from "@/backend/controllers/admin-controller";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getAdminStats();

  if ("error" in res) {
    return NextResponse.json(
      { error: { message: res.error.message } },
      { status: res.error.statusCode }
    );
  }

  return NextResponse.json({ data: res });
}
