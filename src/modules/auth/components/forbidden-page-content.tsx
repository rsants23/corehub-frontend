"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function ForbiddenPageContent() {
  return (
    <AppShell title="Acesso negado" description="Você não tem permissão para esta área">
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <ShieldX className="h-12 w-12 text-destructive" />
        <div>
          <p className="text-lg font-semibold">Sem permissão</p>
          <p className="text-sm text-muted-foreground">
            Seu perfil não permite acessar esta funcionalidade.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.dashboard}>Voltar ao dashboard</Link>
        </Button>
      </div>
    </AppShell>
  );
}
