"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { setAuthSessionCookie } from "@/lib/auth-cookie";
import { setUnauthorizedHandler } from "@/services/auth-interceptor";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, isAuthenticated, restoreSession, logout } = useAuthStore();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      router.replace(ROUTES.login);
    });
  }, [logout, router]);

  useEffect(() => {
    if (!isHydrated) return;
    if (pathname.startsWith("/admin")) return;

    void restoreSession().then(() => {
      const { isAuthenticated: authed } = useAuthStore.getState();
      if (authed) {
        setAuthSessionCookie();
        if (pathname === ROUTES.login) {
          router.replace(ROUTES.dashboard);
        }
      }
    });
  }, [isHydrated, pathname, restoreSession, router]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      setAuthSessionCookie();
    }
  }, [isHydrated, isAuthenticated]);

  return <>{children}</>;
}
