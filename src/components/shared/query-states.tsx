"use client";

import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

export function ErrorState({
  message = "Erro ao carregar dados da API.",
}: {
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}
