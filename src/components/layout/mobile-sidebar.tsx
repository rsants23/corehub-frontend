"use client";

import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const clinicLabel = user?.clinic?.tradeName ?? "Efata CoreHub";

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <BrandLogo variant="full" size="md" className="min-w-0 flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <SidebarNav onNavigate={onClose} />

        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-xs font-medium text-sidebar-foreground/80">
            {clinicLabel}
          </p>
        </div>
      </aside>
    </>
  );
}
