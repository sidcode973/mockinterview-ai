
import { getInterviews } from "@/backend/controllers/interview-controller";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    const res = await getInterviews(request)  ;
    
    const { interviews = [], resPerPage = 0, filteredCount = 0 } = 'interviews' in res ? res : {};

    return NextResponse.json({ interviews, resPerPage, filteredCount }) ;
}