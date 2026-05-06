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

    // ── Admin API: must be admin, otherwise 401 JSON ─────────────────────────
    if (url?.startsWith("/api/admin") && !isAdminUser) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to access this resource",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Admin pages: must be admin, otherwise bounce home ────────────────────
    if (url?.startsWith("/admin") && !isAdminUser) {
      return NextResponse.redirect(new URL("/", req?.url));
    }

    // ── App pages: logged-in but no subscription → /subscribe ────────────────
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
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/subscribe",
    "/unsubscribe",
    "/api/admin/:path*",
    "/api/dashboard/:path*",
    "/api/interviews/:path*",
    "/api/invoices/:path*",
  ],
};
