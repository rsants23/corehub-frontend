"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

const ADMIN_ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  SUPPORT: "Suporte",
} as const;

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    router.push(ADMIN_ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
          {description && (
            <p className="truncate text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role ? ADMIN_ROLE_LABELS[user.role] : ""}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            aria-label="Sair do painel admin"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AdminSidebarBrand() {
  return (
    <div className="flex h-16 items-center border-b border-sidebar-border px-4">
      <BrandLogo variant="full" size="md" className="min-w-0" />
    </div>
  );
}
