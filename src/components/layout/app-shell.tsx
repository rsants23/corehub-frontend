"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface AppShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="relative z-10 min-h-screen md:ml-64">
        <Header title={title} description={description} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
