"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/utils/cn";

interface AppShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "relative z-10 min-h-screen transition-[margin] duration-200",
          collapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        <Header
          title={title}
          description={description}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
