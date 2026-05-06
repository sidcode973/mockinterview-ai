import React from "react";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-default-200 border-t-primary" />
        <p className="text-sm text-default-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}
