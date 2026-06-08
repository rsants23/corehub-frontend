import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-cookie";
import { ROUTES } from "@/constants/routes";

const PROTECTED_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.patients,
  ROUTES.therapists,
  ROUTES.schedules,
  ROUTES.absences,
  ROUTES.rescheduling,
  ROUTES.reports,
  ROUTES.users,
  ROUTES.settings,
  ROUTES.audit,
  ROUTES.forbidden,
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(AUTH_SESSION_COOKIE);

  if (pathname === ROUTES.login && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasSession ? ROUTES.dashboard : ROUTES.login, request.url),
    );
  }

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
