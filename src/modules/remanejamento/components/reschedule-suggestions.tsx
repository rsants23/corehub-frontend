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
import { SuggestionStatusBadge } from "@/components/shared/status-badge";
import type { RescheduleSuggestion } from "@/types";

interface RescheduleSuggestionsProps {
  initialSuggestions: RescheduleSuggestion[];
}

export function RescheduleSuggestions({
  initialSuggestions,
}: RescheduleSuggestionsProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 800);
  };

  const updateStatus = (id: string, status: RescheduleSuggestion["status"]) => {
    setSuggestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={isGenerating}>
          <RefreshCw
            className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
          />
          Gerar sugestões
        </Button>
      </div>

      <div className="grid gap-4">
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
                <SuggestionStatusBadge status={suggestion.status} />
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
                  <Button
                    size="sm"
                    onClick={() => updateStatus(suggestion.id, "ACCEPTED")}
                  >
                    <Check className="h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(suggestion.id, "REJECTED")}
                  >
                    <X className="h-4 w-4" />
                    Rejeitar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" />
                    Alterar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
