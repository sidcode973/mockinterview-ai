"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card } from "@heroui/react";

type StatItem = {
  date: string;
  totalInterviews: number;
  completedQuestion: number;
  unasweredQuestion: number;
  completionRate: number;
};

type Props = {
  stats: StatItem[];
};

export default function DashboardStatsChart({ stats }: Props) {
  return (
    <Card className="p-5 border border-default-100 dark:border-default-100">
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={stats}
          margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--heroui-default-200))"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--heroui-default-200))",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="totalInterviews"
            name="Total Interviews"
            fill="hsl(var(--heroui-primary))"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="completedQuestion"
            name="Completed Questions"
            fill="hsl(var(--heroui-success))"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="unasweredQuestion"
            name="Unanswered Questions"
            fill="hsl(var(--heroui-warning))"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
