"use client";

import { getPageTitle } from "@/helpers/PageTitle";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const usePageTitle = () => {
  const pathname = usePathname();

  const { title, breadcrumbs } = useMemo(() => {
    const { title, breadcrumb } = getPageTitle(pathname);
    return {
      title,
      breadcrumbs: breadcrumb || [{ name: "Home", path: "/" }],
    };
  }, [pathname]);

  return { title, breadcrumbs };
};

export default usePageTitle;