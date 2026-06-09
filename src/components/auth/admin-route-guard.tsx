"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { LoadingState } from "@/components/shared/query-states";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, isLoading } = useAdminAuthStore();

  useEffect(() => {
    if (!isHydrated || isLoading) return;

    if (!isAuthenticated) {
      router.replace(ADMIN_ROUTES.login);
    }
  }, [isAuthenticated, isHydrated, isLoading, router]);

  if (!isHydrated || isLoading) {
    return (
      <AdminShell title="Carregando" description="Restaurando sessão admin...">
        <LoadingState message="Verificando autenticação administrativa..." />
      </AdminShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
