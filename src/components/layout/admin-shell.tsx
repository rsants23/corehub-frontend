"use client";

import { AdminHeader, AdminSidebarBrand } from "@/components/layout/admin-header";
import { AdminSidebarNav } from "@/components/layout/admin-sidebar";

interface AdminShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <AdminSidebarBrand />
        <AdminSidebarNav />
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/70">
            Ambiente administrativo global
          </p>
        </div>
      </aside>

      <div className="relative z-10 min-h-screen md:ml-64">
        <AdminHeader title={title} description={description} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
