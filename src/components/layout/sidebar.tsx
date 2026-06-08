"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  ScrollText,
  Settings,
  Shuffle,
  Stethoscope,
  UserCog,
  UserX,
  Users,
} from "lucide-react";
import { getNavItemsForRole } from "@/constants/routes";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

const iconMap = {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  UserX,
  Shuffle,
  BarChart3,
  Settings,
  UserCog,
  ScrollText,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const navItems = getNavItemsForRole(user?.role);

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

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {user?.role === "THERAPIST" && item.href.includes("agendas")
                ? "Minha Agenda"
                : item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="truncate text-xs font-medium text-sidebar-foreground/80">
          {clinicLabel}
        </p>
      </div>
    </aside>
  );
}
