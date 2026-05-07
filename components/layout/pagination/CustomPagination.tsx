"use client";

import { Pagination } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Props = {
  resPerPage: number;
  filteredCount: number;
};

export default function CustomPagination({ resPerPage, filteredCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(filteredCount / resPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      showControls
      showShadow
      size="lg"
      radius="lg"
      classNames={{
        wrapper: "gap-2",
        item: "w-10 h-10 text-sm font-medium bg-default-100/40 backdrop-blur-md hover:bg-default-200/50 transition-colors",
        cursor:
          "w-10 h-10 text-sm font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md shadow-fuchsia-500/40",
        prev: "w-10 h-10 bg-default-100/40 backdrop-blur-md hover:bg-default-200/50 transition-colors",
        next: "w-10 h-10 bg-default-100/40 backdrop-blur-md hover:bg-default-200/50 transition-colors",
      }}
      page={currentPage}
      total={totalPages}
      onChange={handlePageChange}
    />
  );
}
