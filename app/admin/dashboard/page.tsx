import Dashboard from "@/components/admin/dashboard/Dashboard";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

export const dynamic = "force-dynamic";

async function getDashboardStats(queryStr: string) {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/admin/stats?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load admin stats";
    throw new Error(message);
  }
}

const AdminDashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const queryStr = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [
      string,
      string
    ][]
  ).toString();

  const data = await getDashboardStats(queryStr);

  return <Dashboard data={data?.data} />;
};

export default AdminDashboardPage;
