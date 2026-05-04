import withAuth from "next-auth/middleware";
import { IUser } from "./backend/models/user-model";
import { isUserAdmin, isUserSubscribed } from "./helpers/auth";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req?.nextUrl?.pathname;
    const user = req?.nextauth?.token?.user as IUser;

    const isSubscribed = isUserSubscribed(user);
    const isAdminUser = isUserAdmin(user);

    // Logged in but no subscription → bounce them to /subscribe instead of dropping silently
    if (url?.startsWith("/app") && !isSubscribed && !isAdminUser) {
      return NextResponse.redirect(new URL("/subscribe", req?.url));
    }
  },
  {
    pages: {
      // Unauthenticated users get sent here (instead of NextAuth's default /api/auth/signin)
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/app/:path*", "/api/interviews/:path*"],
};