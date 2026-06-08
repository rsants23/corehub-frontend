"use client";

import { useState } from "react";
import { Check, Pencil, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { SuggestionStatusBadge } from "@/components/shared/status-badge";
import {
  useRescheduleSuggestions,
  useReschedulingMutations,
} from "@/hooks/use-rescheduling";
import { HttpError } from "@/services/http-client";
import { getTodayDate } from "@/utils/date";
import { useToastStore } from "@/stores/toast-store";

export function RescheduleSuggestionsPage() {
  const [date, setDate] = useState(getTodayDate());
  const showToast = useToastStore((state) => state.showToast);
  const { data: suggestions, isLoading, isError, error } =
    useRescheduleSuggestions(date);
  const { generate, accept, reject } = useReschedulingMutations(date);

  const handleGenerate = async () => {
    try {
      await generate.mutateAsync();
      showToast("Sugestões geradas via API");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao gerar sugestões",
      );
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await accept.mutateAsync(id);
      showToast("Sugestão aprovada na API");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao aprovar sugestão",
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reject.mutateAsync(id);
      showToast("Sugestão rejeitada na API");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao rejeitar sugestão",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          />
        </div>
        <Button onClick={handleGenerate} disabled={generate.isPending}>
          <RefreshCw
            className={`h-4 w-4 ${generate.isPending ? "animate-spin" : ""}`}
          />
          Gerar sugestões
        </Button>
      </div>

      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={
            error instanceof HttpError
              ? error.message
              : "Erro ao carregar sugestões."
          }
        />
      )}

      {suggestions && (
        <div className="grid gap-4">
          {suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma sugestão para esta data. Gere a agenda do dia, registre
              faltas e clique em &quot;Gerar sugestões&quot;.
            </p>
          )}
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {suggestion.affectedPatient}
                    </CardTitle>
                    <CardDescription>
                      {suggestion.cancelledAppointment}
                    </CardDescription>
                  </div>
                  <SuggestionStatusBadge
                    status={
                      suggestion.status as
                        | "PENDING"
                        | "ACCEPTED"
                        | "REJECTED"
                        | "APPLIED"
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Novo horário</p>
                    <p className="font-medium">{suggestion.suggestedTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Terapeuta sugerido</p>
                    <p className="font-medium">{suggestion.suggestedTherapist}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confiança</p>
                    <p className="font-medium">{suggestion.confidenceLevel}%</p>
                  </div>
                </div>

                {suggestion.status === "PENDING" && (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleAccept(suggestion.id)}>
                      <Check className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(suggestion.id)}
                    >
                      <X className="h-4 w-4" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        showToast("Alteração manual — use PATCH na API")
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      Alterar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
