"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const filters = [
  { key: "all",       label: "All",       icon: "solar:layers-minimalistic-bold" },
  { key: "pending",   label: "Pending",   icon: "solar:clock-circle-bold" },
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
    // Reset page when filter changes
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-default-200/70 bg-default-50/60 backdrop-blur-sm shadow-sm">
      {filters.map((f) => {
        const isActive = current === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => handleChange(f.key)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-default-500 hover:text-default-700 hover:bg-default-100"}
            `}
          >
            <Icon icon={f.icon} width={15} />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
