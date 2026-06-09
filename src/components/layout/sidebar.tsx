"use client";

import { Calendar } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuthStore } from "@/stores/auth-store";

export function Sidebar() {
  const user = useAuthStore((state) => state.user);

  const clinicLabel =
    user?.role === "THERAPIST" && user?.clinic?.tradeName
      ? `${user.clinic.tradeName} — Minha Agenda`
      : user?.clinic?.tradeName ?? "Efata CoreHub";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Efata CoreHub</p>
          <p className="text-xs text-sidebar-foreground/70">SaaS clínico</p>
        </div>
      </div>

      <SidebarNav />

      <div className="border-t border-sidebar-border p-4">
        <p className="truncate text-xs font-medium text-sidebar-foreground/80">
          {clinicLabel}
        </p>
      </div>
    </aside>
  );
}
