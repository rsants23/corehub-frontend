"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_LABELS, ROUTES } from "@/constants/routes";
import { ClinicSwitcher } from "@/components/layout/clinic-switcher";
import { useAuthStore } from "@/stores/auth-store";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    void logout().then(() => router.push(ROUTES.login));
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
            {description && (
              <p className="truncate text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ClinicSwitcher />
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="w-56 pl-9"
              aria-label="Buscar"
            />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.name ?? "Usuário"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role ? ROLE_LABELS[user.role] : ""}
              {user?.clinic?.tradeName ? ` · ${user.clinic.tradeName}` : ""}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
