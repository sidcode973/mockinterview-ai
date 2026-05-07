"use client";

import React from "react";
import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { MotionStagger, MotionStaggerItem } from "@/components/ui/motion";
import CountUp from "@/components/ui/CountUp";

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

export default function DashboardStats({ data }: Props) {
  const stats = [
    {
      title: "Total Users",
      numeric: data?.totalUsers,
      bgColor: "bg-fuchsia-500/15",
      iconColor: "text-fuchsia-500",
      ringColor: "ring-fuchsia-500/30",
      iconName: "solar:users-group-rounded-linear",
      link: "/admin/users",
    },
    {
      title: "Active Subs",
      numeric: data?.activeSubscriptions,
      bgColor: "bg-amber-500/15",
      iconColor: "text-amber-500",
      ringColor: "ring-amber-500/30",
      iconName: "solar:users-group-two-rounded-bold",
      link: "/admin/users?subscription.status=active",
    },
    {
      title: "Active Subs ($)",
      numeric: data?.subscriptionWorth,
      prefix: "$",
      bgColor: "bg-emerald-500/15",
      iconColor: "text-emerald-500",
      ringColor: "ring-emerald-500/30",
      iconName: "solar:dollar-minimalistic-broken",
      link: "/admin/users",
    },
    {
      title: "Total Interviews",
      numeric: data?.totalInterviews,
      bgColor: "bg-rose-500/15",
      iconColor: "text-rose-500",
      ringColor: "ring-rose-500/30",
      iconName: "solar:user-speak-bold",
      link: "/admin/interviews",
    },
    {
      title: "Completion Rate",
      numeric: data?.interviewCompletionRate,
      suffix: "%",
      bgColor: "bg-cyan-500/15",
      iconColor: "text-cyan-500",
      ringColor: "ring-cyan-500/30",
      iconName: "tabler:percentage",
      link: "/admin/interviews",
    },
    {
      title: "Interviews / user",
      numeric: data?.averageInterviewsPerUser,
      decimals: 1,
      bgColor: "bg-violet-500/15",
      iconColor: "text-violet-500",
      ringColor: "ring-violet-500/30",
      iconName: "tabler:user-hexagon",
      link: "/admin/interviews",
    },
  ];

  return (
    <MotionStagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {stats.map(
        ({ title, numeric, prefix, suffix, decimals, bgColor, iconColor, ringColor, iconName, link }, index) => (
          <MotionStaggerItem key={index}>
            <GlassCard variant="soft" className="overflow-hidden h-full transition-shadow hover:ring-glow">
              <div className="flex p-5">
                <div
                  className={cn(
                    "mt-1 flex h-10 w-10 items-center justify-center rounded-xl ring-1",
                    bgColor,
                    ringColor
                  )}
                >
                  <Icon className={iconColor} icon={iconName} width={22} />
                </div>

                <div className="flex flex-col gap-y-1 ml-3">
                  <dt className="text-small font-medium text-default-500">{title}</dt>
                  <dd className="text-2xl font-semibold text-foreground tabular-nums">
                    <CountUp value={numeric ?? 0} prefix={prefix} suffix={suffix} decimals={decimals} />
                  </dd>
                </div>
              </div>

              <div className="border-t border-default-200/30">
                <Button
                  fullWidth
                  className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100 hover:bg-default-100/30 transition-colors"
                  radius="none"
                  variant="light"
                  as={Link}
                  href={link}
                >
                  View Details
                </Button>
              </div>
            </GlassCard>
          </MotionStaggerItem>
        )
      )}
    </MotionStagger>
  );
}
