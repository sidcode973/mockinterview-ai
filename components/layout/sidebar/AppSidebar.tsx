"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { cn, Listbox, ListboxItem } from "@heroui/react";
import { Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { adminPages, appPages } from "@/constants/pages";
import { Key } from "@react-types/shared";
import { getPageIconAndPath } from "@/helpers/helper";

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
}

export const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      className,
      "flex items-center rounded-small justify-center w-7 h-7"
    )}
  >
    {children}
  </div>
);

const AppSiderbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pages = pathname?.includes("/admin") ? adminPages : appPages;

  const [selectedKey, setSelectedKey] = useState<Key>(pathname);

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const handleAction = (key: Key) => {
    setSelectedKey(key);
    router.push(key?.toString());
  };

  return (
    <div className="h-full p-2">
      <div className="h-full rounded-xl border border-default-200/60 dark:border-default-100/20 bg-gradient-to-b from-content1 to-content1/80 shadow-lg overflow-hidden backdrop-blur-sm">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-t-xl" />

        <Listbox
          aria-label="User Menu"
          className="py-3 gap-0 bg-transparent h-full"
          itemClasses={{
            base: "px-3 rounded-lg mx-1 h-11 data-[hover=true]:bg-default-100/70 transition-colors duration-150",
          }}
          selectedKeys={[selectedKey]}
          onAction={handleAction}
        >
          <ListboxItem
            key="#"
            className="mb-2 px-2"
            textValue="New Interview"
            startContent={
              <Button
                className="bg-foreground font-medium text-background w-full"
                color="secondary"
                endContent={<Icon icon="ep:circle-plus-filled" />}
                variant="flat"
                as={Link}
                href="/app/interviews/new"
              >
                New Interview
              </Button>
            }
          />
          <>
            {pages?.map((page) => (
              <ListboxItem
                key={page.path}
                className={`gap-3 ${
                  selectedKey?.toString()?.includes(page.path)
                    ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-l-2 border-violet-500 !rounded-l-none font-semibold"
                    : ""
                }`}
                startContent={
                  <IconWrapper
                    className={`bg-${
                      getPageIconAndPath(page.path).color
                    }/10 text-${getPageIconAndPath(page.path).color}`}
                  >
                    <Icon
                      icon={getPageIconAndPath(page.path)?.icon}
                      className="text-lg"
                    />
                  </IconWrapper>
                }
                textValue=""
              >
                {page.title}
              </ListboxItem>
            ))}
          </>
        </Listbox>
      </div>
    </div>
  );
};

export default AppSiderbar;