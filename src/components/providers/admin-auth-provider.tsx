"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { setAdminAuthSessionCookie } from "@/lib/admin-auth-cookie";
import { setAdminUnauthorizedHandler } from "@/services/admin-http-client";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isHydrated, isAuthenticated, restoreSession, logout } =
    useAdminAuthStore();

  useEffect(() => {
    setAdminUnauthorizedHandler(() => {
      logout();
      router.replace(ADMIN_ROUTES.login);
    });
  }, [logout, router]);

  useEffect(() => {
    if (!isHydrated) return;

    void restoreSession().then(() => {
      const { isAuthenticated: authed } = useAdminAuthStore.getState();
      if (authed) {
        setAdminAuthSessionCookie();
        if (pathname === ADMIN_ROUTES.login) {
          router.replace(ADMIN_ROUTES.dashboard);
        }
      }
    });
  }, [isHydrated, pathname, restoreSession, router]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      setAdminAuthSessionCookie();
    }
  }, [isHydrated, isAuthenticated]);

  return <>{children}</>;
}
