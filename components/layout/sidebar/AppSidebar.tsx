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
      <div className="relative h-full rounded-2xl glass shadow-xl overflow-hidden">
        <div
          className="absolute -top-px left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(178,73,248,0.7), rgba(34,211,238,0.7), rgba(255,28,247,0.7), transparent)",
          }}
        />

        <Listbox
          aria-label="User Menu"
          className="py-3 gap-0 bg-transparent h-full"
          itemClasses={{
            base: "px-3 rounded-lg mx-1 h-11 data-[hover=true]:bg-default-100/50 transition-all duration-200",
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
                className="w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 animate-gradient-pan font-medium text-white shadow-md shadow-fuchsia-500/30"
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
                    ? "bg-gradient-to-r from-fuchsia-500/15 via-violet-500/10 to-cyan-500/10 border-l-2 border-fuchsia-500 !rounded-l-none font-semibold"
                    : ""
                }`}
                startContent={
                  <IconWrapper
                    className={`bg-${
                      getPageIconAndPath(page.path).color
                    }/15 text-${getPageIconAndPath(page.path).color}`}
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
