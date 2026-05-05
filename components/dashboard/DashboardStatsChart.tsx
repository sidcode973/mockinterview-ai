"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Icon } from "@iconify/react";

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

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatChartDate = (iso: string): string => {
  // Locale-independent so SSR/CSR match (e.g. "May 5")
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
};

// ── Custom Tooltip ───────────────────────────────────────────────────────────

type TooltipPayloadEntry = {
  dataKey?: string | number;
  value?: number | string;
  name?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const get = (key: string) => {
    const entry = payload.find((p) => p.dataKey === key);
    const v = entry?.value;
    return typeof v === "number" ? v : undefined;
  };

  const total = get("totalInterviews") ?? 0;
  const completed = get("completedQuestion") ?? 0;
  const unanswered = get("unasweredQuestion") ?? 0;
  const rate = get("completionRate") ?? 0;

  return (
    <div className="rounded-xl border border-default-200/80 bg-background/95 backdrop-blur-md px-4 py-3 shadow-lg shadow-default-200/50">
      <p className="text-xs font-semibold text-default-500 mb-2 uppercase tracking-wider">
        {formatChartDate(label ?? "")}
      </p>
      <div className="flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-default-600">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Interviews
          </span>
          <span className="font-semibold text-default-800">{total}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-default-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Completed Qs
          </span>
          <span className="font-semibold text-default-800">{completed}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-default-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Unanswered Qs
          </span>
          <span className="font-semibold text-default-800">{unanswered}</span>
        </div>
        <div className="mt-1 pt-2 border-t border-default-200/60 flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-default-600">
            <Icon icon="solar:graph-up-bold" className="text-fuchsia-500" />
            Completion
          </span>
          <span className="font-bold text-fuchsia-500">{rate}%</span>
        </div>
      </div>
    </div>
  );
};

// ── Summary metric card ──────────────────────────────────────────────────────

const MetricCard = ({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color: "violet" | "emerald" | "amber" | "fuchsia";
}) => {
  const colorMap = {
    violet:  { bg: "bg-violet-500/10",  text: "text-violet-500",  ring: "ring-violet-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20" },
    amber:   { bg: "bg-amber-500/10",   text: "text-amber-500",   ring: "ring-amber-500/20" },
    fuchsia: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-500", ring: "ring-fuchsia-500/20" },
  };
  const c = colorMap[color];

  return (
    <div className={`flex items-center gap-3 rounded-xl border border-default-200/60 bg-default-50/40 p-4 ring-1 ${c.ring}`}>
      <div className={`shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg ${c.bg}`}>
        <Icon icon={icon} className={`${c.text} text-lg`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-default-500">{label}</p>
        <p className="text-xl font-bold text-default-800 leading-tight tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-default-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

export default function DashboardStatsChart({ stats }: Props) {
  // Format date strings on x-axis + compute summary metrics
  const chartData = useMemo(
    () => stats.map((s) => ({ ...s, label: formatChartDate(s.date) })),
    [stats]
  );

  const summary = useMemo(() => {
    const totalInterviews    = stats.reduce((a, s) => a + (s.totalInterviews ?? 0), 0);
    const completedQs        = stats.reduce((a, s) => a + (s.completedQuestion ?? 0), 0);
    const unansweredQs       = stats.reduce((a, s) => a + (s.unasweredQuestion ?? 0), 0);
    const totalQs            = completedQs + unansweredQs;
    const avgCompletion      = stats.length
      ? stats.reduce((a, s) => a + Number(s.completionRate ?? 0), 0) / stats.length
      : 0;
    const peakDay            = stats.reduce(
      (best, s) => (s.totalInterviews > (best?.totalInterviews ?? 0) ? s : best),
      stats[0]
    );
    return {
      totalInterviews,
      completedQs,
      unansweredQs,
      totalQs,
      avgCompletion: Number(avgCompletion.toFixed(1)),
      peakDay,
    };
  }, [stats]);

  return (
    <div className="rounded-2xl border border-default-200/60 bg-content1 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-default-100">
        <div>
          <h3 className="text-base font-semibold text-default-800 tracking-tight">
            Interview Activity
          </h3>
          <p className="text-xs text-default-400 mt-0.5">
            Daily breakdown over the selected period
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-default-200 bg-default-50 px-3 py-1 text-xs font-medium text-default-500">
          <Icon icon="solar:calendar-linear" width={14} />
          {stats.length} {stats.length === 1 ? "day" : "days"}
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-5">
        <MetricCard
          label="Total Interviews"
          value={summary.totalInterviews}
          icon="solar:users-group-rounded-bold"
          color="violet"
        />
        <MetricCard
          label="Questions Answered"
          value={summary.completedQs}
          sub={`of ${summary.totalQs} total`}
          icon="solar:check-circle-bold"
          color="emerald"
        />
        <MetricCard
          label="Avg Completion"
          value={`${summary.avgCompletion}%`}
          icon="solar:graph-up-bold"
          color="fuchsia"
        />
        <MetricCard
          label="Peak Day"
          value={summary.peakDay ? formatChartDate(summary.peakDay.date) : "—"}
          sub={
            summary.peakDay
              ? `${summary.peakDay.totalInterviews} interview${summary.peakDay.totalInterviews === 1 ? "" : "s"}`
              : "no activity"
          }
          icon="solar:medal-star-bold"
          color="amber"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-5 text-xs text-default-500">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-violet-500" />
          Total Interviews
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          Completed Questions
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-amber-500" />
          Unanswered Questions
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-fuchsia-500" />
          Completion Rate (%)
        </span>
      </div>

      {/* Chart */}
      <div className="px-2 sm:px-4 py-4">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart
            data={chartData}
            margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="grad-violet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--heroui-default-200))"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--heroui-default-500))" }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 12, right: 12 }}
            />

            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "hsl(var(--heroui-default-500))" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "hsl(var(--heroui-default-500))" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              cursor={{ fill: "hsl(var(--heroui-default-100))", opacity: 0.5 }}
              content={<CustomTooltip />}
            />

            <Legend content={() => null} />

            <Bar
              yAxisId="left"
              dataKey="totalInterviews"
              name="Total Interviews"
              fill="url(#grad-violet)"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              yAxisId="left"
              dataKey="completedQuestion"
              name="Completed Questions"
              fill="url(#grad-emerald)"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              yAxisId="left"
              dataKey="unasweredQuestion"
              name="Unanswered Questions"
              fill="url(#grad-amber)"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="completionRate"
              name="Completion Rate"
              stroke="#d946ef"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#d946ef", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#d946ef", strokeWidth: 3, stroke: "#fff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
