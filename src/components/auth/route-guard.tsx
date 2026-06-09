"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { canAccessRoute, getHomeRouteForRole, ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingState } from "@/components/shared/query-states";

interface RouteGuardProps {
  children: React.ReactNode;
  path: string;
}

export function RouteGuard({ children, path }: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isHydrated || isLoading) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    if (!canAccessRoute(user?.role, path)) {
      router.replace(getHomeRouteForRole(user?.role));
    }
  }, [isAuthenticated, isHydrated, isLoading, path, router, user?.role]);

  if (!isHydrated || isLoading) {
    return (
      <AppShell title="Carregando" description="Restaurando sessão...">
        <LoadingState message="Verificando autenticação..." />
      </AppShell>
    );
  }

  if (!isAuthenticated || !canAccessRoute(user?.role, path)) {
    return null;
  }

  return <>{children}</>;
}
