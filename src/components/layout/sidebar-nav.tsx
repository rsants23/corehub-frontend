"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
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
  CalendarDays,
  UserX,
  Shuffle,
  BarChart3,
  Settings,
  UserCog,
  ScrollText,
  ShieldCheck,
} as const;

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const navItems = getNavItemsForRole(user?.role);

  return (
    <nav className={cn("flex-1 space-y-1 p-4", className)}>
      {navItems.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  );
}
