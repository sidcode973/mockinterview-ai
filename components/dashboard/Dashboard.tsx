"use client";

import React from "react";
import DashboardStats from "./DashboardStats";
import { useSession } from "next-auth/react";
import { IUser } from "@/backend/models/user-model";
import DashboardStatsChart from "./DashboardStatsChart";
import StatsDatePicker from "../date-picker/StatsDatePicker";
import MotionFadeIn from "../ui/motion/MotionFadeIn";
import GlassCard from "../ui/GlassCard";
import { Icon } from "@iconify/react";

type DashboardProps = {
  data: {
    totalInterviews: number;
    completionRate: number;
    stats: Array<{
      date: string;
      totalInterviews: number;
      completedQuestion: number;
      unasweredQuestion: number;
      completionRate: number;
    }>;
  };
};

const Dashboard = ({ data }: DashboardProps) => {
  const session = useSession();
  const user = session.data?.user as IUser;
  const subscriptionStatus = user?.subscription?.status;

  return (
    <div className="mt-5">
      <MotionFadeIn>
        <DashboardStats
          totalInterviews={data?.totalInterviews}
          completionRate={data?.completionRate}
          subscriptionStatus={subscriptionStatus}
        />
      </MotionFadeIn>

      <MotionFadeIn delay={0.1}>
        <div className="flex justify-between items-center my-12">
          <h1 className="text-xl font-bold leading-none tracking-tight md:text-2xl lg:text-3xl">
            <span className="text-gradient-fusion">Your Interview Stats</span>
          </h1>
          <StatsDatePicker />
        </div>
      </MotionFadeIn>

      {data?.stats?.length > 0 ? (
        <MotionFadeIn delay={0.2}>
          <DashboardStatsChart stats={data.stats} />
        </MotionFadeIn>
      ) : (
        <MotionFadeIn>
          <GlassCard variant="soft" className="flex flex-col justify-center items-center h-80">
            <Icon icon="solar:chart-2-linear" fontSize={56} className="text-default-300 mb-4" />
            <p className="text-default-500 font-medium">
              No interview stats available for the selected date range.
            </p>
          </GlassCard>
        </MotionFadeIn>
      )}
    </div>
  );
};

export default Dashboard;
