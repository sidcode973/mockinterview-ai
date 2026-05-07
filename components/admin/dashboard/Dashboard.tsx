"use client";

import React from "react";
import DashboardStats from "./DashboardStats";
import StatsDatePicker from "@/components/date-picker/StatsDatePicker";
import MotionFadeIn from "@/components/ui/motion/MotionFadeIn";

type Props = {
  data: {
    totalUsers: number;
    activeSubscriptions: number;
    subscriptionWorth: number;
    totalInterviews: number;
    interviewCompletionRate: number;
    averageInterviewsPerUser: number;
  };
};

const Dashboard = ({ data }: Props) => {
  return (
    <div>
      <MotionFadeIn>
        <div className="flex justify-between items-center my-12">
          <h1 className="text-xl font-bold leading-none tracking-tight md:text-2xl lg:text-3xl">
            <span className="text-gradient-fusion">Stats Overview:</span>
          </h1>
          <StatsDatePicker />
        </div>
      </MotionFadeIn>

      <DashboardStats data={data} />
    </div>
  );
};

export default Dashboard;
