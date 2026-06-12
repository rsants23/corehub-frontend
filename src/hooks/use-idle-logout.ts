"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { ROUTES } from "@/constants/routes";
import {
  IDLE_LOGOUT_MESSAGE,
  SESSION_IDLE_TIMEOUT_MS,
  isPublicAuthPath,
} from "@/constants/session";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

interface UseIdleLogoutOptions {
  enabled?: boolean;
}

export function useIdleLogout(options: UseIdleLogoutOptions = {}) {
  const { enabled = true } = options;
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublic = isPublicAuthPath(pathname);

  const clinicAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clinicHydrated = useAuthStore((state) => state.isHydrated);
  const clinicLogout = useAuthStore((state) => state.logout);

  const adminAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const adminHydrated = useAdminAuthStore((state) => state.isHydrated);
  const adminLogout = useAdminAuthStore((state) => state.logout);

  const isAuthenticated = isAdminRoute ? adminAuthenticated : clinicAuthenticated;
  const isHydrated = isAdminRoute ? adminHydrated : clinicHydrated;

  const handleIdleLogout = useCallback(async () => {
    if (isAdminRoute) {
      await adminLogout();
      useToastStore.getState().showToast(IDLE_LOGOUT_MESSAGE, "error");
      router.replace(ADMIN_ROUTES.login);
      return;
    }

    await clinicLogout();
    useToastStore.getState().showToast(IDLE_LOGOUT_MESSAGE, "error");
    router.replace(ROUTES.login);
  }, [adminLogout, clinicLogout, isAdminRoute, router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void handleIdleLogout();
    }, SESSION_IDLE_TIMEOUT_MS);
  }, [handleIdleLogout]);

  useEffect(() => {
    if (!enabled || !isHydrated || !isAuthenticated || isPublic) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const onActivity = () => {
      resetTimer();
    };

    resetTimer();

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, onActivity, { passive: true });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, onActivity);
      }
    };
  }, [
    enabled,
    handleIdleLogout,
    isAuthenticated,
    isHydrated,
    isPublic,
    resetTimer,
  ]);
}
