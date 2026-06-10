"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggle = useSidebarStore((state) => state.toggle);

  const clinicLabel = (() => {
    if (user?.role === "THERAPIST") {
      return user?.clinic?.tradeName
        ? `${user.clinic.tradeName} — Terapeuta`
        : "Portal do Terapeuta";
    }
    if (user?.role === "PATIENT" || user?.role === "GUARDIAN") {
      return user?.clinic?.tradeName
        ? `${user.clinic.tradeName} — Portal`
        : "Portal do Paciente";
    }
    return user?.clinic?.tradeName ?? "Efata CoreHub";
  })();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between gap-2 px-4",
        )}
      >
        {collapsed ? (
          <BrandLogo variant="icon" size="sm" />
        ) : (
          <BrandLogo variant="full" size="md" className="min-w-0 flex-1" />
        )}
        {!collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={toggle}
            aria-label="Recolher menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {collapsed ? (
        <div className="flex justify-center border-b border-sidebar-border py-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggle}
            aria-label="Expandir menu"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <SidebarNav collapsed={collapsed} />

      <div
        className={cn(
          "border-t border-sidebar-border p-4",
          collapsed && "px-2 py-3 text-center",
        )}
      >
        {!collapsed ? (
          <p className="truncate text-xs font-medium text-sidebar-foreground/80">
            {clinicLabel}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
