"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";

const filters = [
  { key: "all", label: "All", icon: "solar:layers-minimalistic-bold" },
  { key: "pending", label: "Pending", icon: "solar:clock-circle-bold" },
  { key: "completed", label: "Completed", icon: "solar:check-circle-bold" },
];

export default function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  const handleChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl glass">
      {filters.map((f) => {
        const isActive = current === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => handleChange(f.key)}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {isActive && (
              <m.span
                layoutId="status-filter-active"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-md shadow-fuchsia-500/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative inline-flex items-center gap-1.5 ${
                isActive ? "text-white" : "text-default-500 hover:text-default-700"
              }`}
            >
              <Icon icon={f.icon} width={15} />
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
