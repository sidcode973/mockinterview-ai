"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import NextLink from "next/link";

import { Logo } from "@/config/Logo";
import HeaderUser from "./HeaderUser";
import { Button, Link, Skeleton, User } from "@heroui/react";
import { Icon } from "@iconify/react";
import { siteConfig } from "@/config/site";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/backend/models/user-model";
import { useState } from "react";
import { isUserAdmin, isUserSubscribed } from "@/helpers/auth";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data } = useSession();
  const user = data?.user as IUser;

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="border-b border-default-200/60 bg-background/80 backdrop-blur-md"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig?.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitcher />
        </NavbarItem>

        {data?.user ? (
          <>
            <NavbarItem className="hidden sm:flex">
              {!isUserSubscribed(user) && (  
              <Button
                size="sm"
                className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-full px-5"
                as={Link}
                href="/subscribe"
              >
                Subscribe for $9.99
              </Button>
              )}
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <HeaderUser user={user} />
            </NavbarItem>
          </>
        ) : (
          <>
            {data === undefined && (
              <Skeleton className="h-8 w-32 rounded-full" />
            )}

            {data === null && (
              <Button
                className="bg-foreground font-medium text-background px-5"
                color="secondary"
                endContent={<Icon icon="solar:alt-arrow-right-linear" />}
                radius="full"
                variant="flat"
                as={Link}
                href="/login"
              >
                Login
              </Button>
            )}
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {data?.user ? (
          <NavbarMenuToggle aria-label="Open menu" />
        ) : (
          data === null && (
            <NavbarItem>
              <Button
                className="bg-foreground font-medium text-background px-5"
                color="secondary"
                endContent={<Icon icon="solar:alt-arrow-right-linear" />}
                radius="full"
                variant="flat"
                as={Link}
                href="/login"
              >
                Login
              </Button>
            </NavbarItem>
          )
        )}
      </NavbarContent>
    
      <NavbarMenu className="pt-16">
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user?.profilePicture?.url
              ? user?.profilePicture?.url
              : "/images/default_user.png",
          }}
          className="transition-transform"
          description={user?.email}
          name={user?.name}
        />
        { isUserAdmin(user)  ? (
        <NavbarMenuItem>
          <Link
            color={"foreground"}
            href="/admin/dashboard"
            size="lg"
            className="flex gap-1"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="tabler:user-cog" /> Admin Dashboard
          </Link>
        </NavbarMenuItem>
        ) : null }

        { isUserAdmin(user) || isUserSubscribed(user) ? (
        <NavbarMenuItem>
          <Link
            color={"foreground"}
            href="/app/dashboard"
            size="lg"
            className="flex gap-1"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="hugeicons:ai-brain-04" /> App Dashboard
          </Link>
        </NavbarMenuItem>
        ) : null }

        <NavbarMenuItem>
          <Link
            color={"danger"}
            as={Link}
            size="lg"
            className="flex gap-1"
            onPress={() => signOut()}
          >
            <Icon icon="tabler:logout-2" /> Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

export default Navbar;
