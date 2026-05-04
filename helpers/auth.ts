import { IUser } from "@/backend/models/user-model";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const getAuthCookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export const getAuthHeader = (nextCookies: ReadonlyRequestCookies) => {
  const cookieName = getAuthCookieName();

  const nextAuthSessionToken = nextCookies.get(cookieName);

  return {
    headers: {
      Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
    },
  };
};

export const isUserAdmin = (user: IUser): boolean => {
  return user?.roles?.includes("admin");
};  

export const isUserSubscribed = (user: IUser): boolean => {
  const sub = user?.subscription;
  if (!sub) return false;

  const isActiveStatus = sub.status === "active" || sub.status === "past_due";
  if (!isActiveStatus) return false;

  // Defense in depth: if a webhook ever failed to fire, don't trust `status`
  // alone — also require the current billing period to still be valid.
  // (Stripe gives a few days grace via past_due, so we add a small buffer.)
  if (sub.currentPeriodEnd) {
    const periodEnd = new Date(sub.currentPeriodEnd).getTime();
    const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7-day grace
    if (Date.now() > periodEnd + gracePeriodMs) return false;
  }

  return true;
};