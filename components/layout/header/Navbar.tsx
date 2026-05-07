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
import MagneticButton from "@/components/ui/MagneticButton";

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
      className="border-b border-default-200/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2 group" href="/">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] p-[1px]">
              <span className="flex h-full w-full items-center justify-center rounded-[7px] bg-background">
                <Logo />
              </span>
            </span>
            <span className="font-bold tracking-tight text-gradient-fusion">
              {siteConfig?.name}
            </span>
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
                <MagneticButton strength={0.3}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-medium rounded-full px-5 shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-shadow"
                    as={Link}
                    href="/subscribe"
                  >
                    Subscribe for $9.99
                  </Button>
                </MagneticButton>
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
              <MagneticButton strength={0.3}>
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
              </MagneticButton>
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

      <NavbarMenu className="pt-16 backdrop-blur-xl bg-background/80">
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
        {isUserAdmin(user) ? (
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
        ) : null}

        {isUserAdmin(user) || isUserSubscribed(user) ? (
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
        ) : null}

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
