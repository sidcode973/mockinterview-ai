"use client";

import Breadcrumb from "@/components/layout/breadcrumb/breadcrumbs";
import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import usePageTitle from "@/hooks/usePageTitle";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { title, breadcrumbs } = usePageTitle();

  return (
    /* items-stretch → sidebar and main column always equal height */
    <div className="flex w-full items-stretch">
      {/* Sidebar — fixed width, stretches with the row */}
      <div className="w-64 shrink-0">
        <AppSidebar />
      </div>

      {/* Main content — flex-col so children can use flex-1 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-6 pt-4">
          <Breadcrumb title={title} breadcrumbs={breadcrumbs} />
        </div>
        <main className="flex-1 flex flex-col px-6 pb-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
