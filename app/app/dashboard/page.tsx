import Dashboard from "@/components/dashboard/Dashboard";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

async function getDashboardStats(queryStr: string) {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/dashboard/stats?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard";
    throw new Error(message);
  }
}

const DashboardPage = async ({
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

export default DashboardPage;