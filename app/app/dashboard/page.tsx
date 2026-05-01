import { Icon } from "@iconify/react";
import Link from "next/link";

const stats = [
  {
    label: "Total Interviews",
    value: "—",
    icon: "solar:user-speak-bold",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    label: "Completed",
    value: "—",
    icon: "solar:check-circle-bold",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    label: "Avg. Score",
    value: "—",
    icon: "solar:chart-bold",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
  },
  {
    label: "Pending",
    value: "—",
    icon: "solar:clock-circle-bold",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
];

const quickLinks = [
  {
    title: "New Interview",
    description: "Start a new AI-powered mock interview session",
    icon: "solar:add-circle-bold",
    href: "/app/interviews/new",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    title: "My Interviews",
    description: "View and manage all your past interviews",
    icon: "solar:list-bold",
    href: "/app/interviews",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    title: "Results",
    description: "Review AI feedback and performance scores",
    icon: "tabler:report-analytics",
    href: "/app/results",
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
  },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8 py-2">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-default-200/60 bg-content1 p-5 shadow-sm flex items-center gap-4"
          >
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <Icon icon={stat.icon} className={`${stat.color} text-xl`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-default-900">{stat.value}</p>
              <p className="text-xs text-default-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-xl border border-default-200/60 bg-content1 p-5 shadow-sm hover:shadow-md hover:border-default-300 transition-all duration-200"
            >
              <div className={`${item.bg} w-fit p-3 rounded-lg mb-4`}>
                <Icon icon={item.icon} className={`${item.color} text-xl`} />
              </div>
              <p className="font-semibold text-default-800 group-hover:text-default-900 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-default-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-500/5 dark:to-fuchsia-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-violet-100 dark:bg-violet-500/20 p-2.5 rounded-lg">
            <Icon icon="solar:lightbulb-bold" className="text-violet-500 text-xl" />
          </div>
          <div>
            <p className="font-semibold text-default-800">Pro tip</p>
            <p className="text-sm text-default-500 mt-1 leading-relaxed">
              Practice at least 3 mock interviews per week to see significant improvement in your performance. Consistency is key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
