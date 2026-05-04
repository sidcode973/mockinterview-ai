import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IUser } from "@/backend/models/user-model";
import { signOut, useSession } from "next-auth/react";
import { isUserAdmin, isUserSubscribed } from "@/helpers/auth";

const HeaderUser = ({ user }: { user: IUser }) => {
  const { data } = useSession();
  const provider = data?.provider;

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <button className="flex items-center gap-3 outline-none">
            <div className="relative w-fit">
              <Avatar
                isBordered
                src={
                  user?.profilePicture?.url
                    ? user?.profilePicture?.url
                    : "/images/default_user.png"
                }
                size="sm"
              />
              {provider === "google" && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-md z-10">
                  <Icon icon="flat-color-icons:google" className="w-3.5 h-3.5" />
                </span>
              )}
              {provider === "github" && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-md z-10">
                  <Icon icon="mdi:github" className="w-3.5 h-3.5 text-gray-900" />
                </span>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold leading-tight">{user?.name}</span>
              <span className="text-xs text-slate-500 font-medium leading-tight">{user?.email}</span>
            </div>
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{user?.email}</p>
          </DropdownItem>
         { isUserAdmin(user) ? (
          <DropdownItem
            key="admin_dashboard"
            href="/admin/dashboard"
            startContent={<Icon icon="tabler:user-cog" />}
          >
            Admin Dashboard
          </DropdownItem>
          ) : null }

          { isUserAdmin(user) || isUserSubscribed(user) ? (
          <DropdownItem
            key="app_dashboard"
            href="/app/dashboard"
            startContent={<Icon icon="hugeicons:ai-brain-04" />}
          >
            App Dashboard
          </DropdownItem>
          ) : null }
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<Icon icon="tabler:logout-2" />}
            onPress={() => signOut()}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderUser;