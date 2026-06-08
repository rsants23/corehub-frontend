"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUnauthorizedHandler } from "@/services/auth-interceptor";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTES } from "@/constants/routes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isHydrated, restoreSession, logout } = useAuthStore();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      router.replace(ROUTES.login);
    });
  }, [logout, router]);

  useEffect(() => {
    if (isHydrated) {
      void restoreSession();
    }
  }, [isHydrated, restoreSession]);

  return <>{children}</>;
}
