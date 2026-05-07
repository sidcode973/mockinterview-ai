"use client";

import React from "react";
import { Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import GlassCard from "@/components/ui/GlassCard";
import { MotionStagger, MotionStaggerItem } from "@/components/ui/motion";
import CountUp from "@/components/ui/CountUp";

type Props = {
  totalInterviews: number;
  completionRate: number;
  subscriptionStatus?: string;
};

export default function DashboardStats({
  totalInterviews,
  completionRate,
  subscriptionStatus,
}: Props) {
  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const data = [
    {
      title: "Total Interviews",
      numeric: totalInterviews || 0,
      bgColor: "bg-fuchsia-500/15",
      iconColor: "text-fuchsia-500",
      ringColor: "ring-fuchsia-500/30",
      iconName: "solar:users-group-rounded-linear",
      isNumeric: true,
    },
    {
      title: "Completion Rate",
      numeric: completionRate || 0,
      suffix: "%",
      bgColor: "bg-cyan-500/15",
      iconColor: "text-cyan-500",
      ringColor: "ring-cyan-500/30",
      iconName: "solar:users-group-two-rounded-bold",
      isNumeric: true,
    },
    {
      title: "Subscription",
      stringValue: subscriptionStatus
        ? capitalizeFirstLetter(subscriptionStatus)
        : "No Subscription",
      bgColor: "bg-emerald-500/15",
      iconColor: "text-emerald-500",
      ringColor: "ring-emerald-500/30",
      iconName: "solar:dollar-minimalistic-broken",
      change: "$9.99",
      isNumeric: false,
    },
  ];

  return (
    <MotionStagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => (
        <MotionStaggerItem key={index}>
          <GlassCard variant="soft" className="relative h-full transition-shadow hover:ring-glow">
            <div className="flex p-5">
              <div
                className={cn(
                  "mt-1 flex h-10 w-10 items-center justify-center rounded-xl ring-1",
                  item.bgColor,
                  item.ringColor
                )}
              >
                <Icon className={item.iconColor} icon={item.iconName} width={22} />
              </div>

              <div className="flex flex-col gap-y-1 ml-3">
                <dt className="text-small font-medium text-default-500">{item.title}</dt>
                <dd className="text-2xl font-semibold text-foreground tabular-nums">
                  {item.isNumeric ? (
                    <CountUp value={item.numeric ?? 0} suffix={item.suffix ?? ""} />
                  ) : (
                    item.stringValue
                  )}
                </dd>
              </div>

              {item.change && (
                <Chip
                  className="absolute right-4 top-4"
                  classNames={{ content: "font-semibold text-[0.8rem]" }}
                  color="success"
                  radius="sm"
                  size="sm"
                  variant="flat"
                >
                  {item.change}
                </Chip>
              )}
            </div>
          </GlassCard>
        </MotionStaggerItem>
      ))}
    </MotionStagger>
  );
}
