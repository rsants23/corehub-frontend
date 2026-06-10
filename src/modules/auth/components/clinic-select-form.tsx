"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES, getHomeRouteForRole } from "@/constants/routes";
import { getErrorMessage } from "@/services/api-error";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import type { UserRole } from "@/types/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordenação",
  RECEPTION: "Recepção",
  THERAPIST: "Terapeuta",
  PATIENT: "Paciente",
  GUARDIAN: "Responsável",
};

export function ClinicSelectForm() {
  const router = useRouter();
  const pending = useAuthStore((s) => s.pendingClinicSelection);
  const selectClinic = useAuthStore((s) => s.selectClinic);
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useToastStore((s) => s.showToast);

  if (!pending) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="py-8 text-center text-muted-foreground">
          Sessão de seleção expirada. Faça login novamente.
          <Button
            className="mt-4"
            onClick={() => router.push(ROUTES.login)}
          >
            Ir para login
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSelect = async (clinicId: string, available: boolean) => {
    if (!available) {
      showToast("Esta clínica está indisponível no momento.", "error");
      return;
    }

    try {
      await selectClinic(clinicId);
      const role = useAuthStore.getState().user?.role;
      showToast("Clínica selecionada com sucesso", "success");
      router.push(getHomeRouteForRole(role));
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao selecionar clínica"), "error");
    }
  };

  return (
    <Card className="w-full max-w-lg border shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <CardTitle>Selecione a clínica</CardTitle>
        <CardDescription>
          Olá, {pending.identity.name}. Você possui acesso a mais de uma
          clínica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {pending.clinics.map((clinic) => (
          <button
            key={clinic.clinicId}
            type="button"
            disabled={isLoading || !clinic.available}
            onClick={() => void handleSelect(clinic.clinicId, clinic.available)}
            className={`w-full rounded-lg border p-4 text-left transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60 ${
              clinic.available ? "" : "border-dashed"
            }`}
          >
            <div className="font-semibold">{clinic.tradeName}</div>
            <div className="text-sm text-muted-foreground">
              {clinic.legalName}
            </div>
            <div className="mt-1 text-sm">
              Perfil: {ROLE_LABELS[clinic.role]}
            </div>
            {!clinic.available && (
              <div className="mt-2 text-sm text-destructive">
                {clinic.blockReason ?? "Indisponível"}
              </div>
            )}
          </button>
        ))}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push(ROUTES.login)}
        >
          Voltar ao login
        </Button>
      </CardContent>
    </Card>
  );
}
