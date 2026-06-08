"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { AbsenceForm } from "@/modules/faltas/components/absence-form";
import { AbsencesList } from "@/modules/faltas/components/absences-list";
import type { AbsenceFormValues } from "@/modules/faltas/schemas/absence.schema";
import {
  useAbsenceMutations,
  useAbsences,
  useDailyAppointments,
} from "@/hooks/use-absences";
import { useTherapists } from "@/hooks/use-therapists";
import { useScheduleMutations } from "@/hooks/use-schedules";
import { HttpError } from "@/services/http-client";
import { getTodayDate } from "@/utils/date";
import { useToastStore } from "@/stores/toast-store";
import { Button } from "@/components/ui/button";

export function AbsencesPageContent() {
  const [date, setDate] = useState(getTodayDate());
  const showToast = useToastStore((state) => state.showToast);
  const { data: absences, isLoading, isError, error } = useAbsences(date);
  const { data: therapists } = useTherapists();
  const { data: appointments } = useDailyAppointments(date);
  const { createTherapistAbsence, createPatientCancellation } =
    useAbsenceMutations(date);
  const { generateDaily } = useScheduleMutations();

  const handleRegister = async (values: AbsenceFormValues) => {
    try {
      if (values.type === "therapist" && values.therapistId) {
        await createTherapistAbsence.mutateAsync({
          therapistId: values.therapistId,
          date: values.date,
          fullDay: true,
          reason: values.reason,
        });
      } else if (values.type === "patient" && values.appointmentId) {
        const appointment = appointments?.find(
          (a) => a.id === values.appointmentId,
        );
        if (!appointment) throw new Error("Atendimento não encontrado");
        await createPatientCancellation.mutateAsync({
          patientId: appointment.patientId,
          appointmentId: values.appointmentId,
          date: values.date,
          reason: values.reason,
        });
      }
      showToast("Falta registrada na API");
    } catch (err) {
      showToast(
        err instanceof HttpError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Erro ao registrar falta",
      );
    }
  };

  const handleGenerateDaily = async () => {
    try {
      await generateDaily.mutateAsync(date);
      showToast("Agenda do dia gerada na API");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao gerar agenda do dia",
      );
    }
  };

  return (
    <AppShell
      title="Faltas"
      description="Ausências de terapeutas e cancelamentos de pacientes"
    >
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleGenerateDaily}
          disabled={generateDaily.isPending}
        >
          {generateDaily.isPending ? "Gerando..." : "Gerar agenda do dia"}
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AbsenceForm
          therapists={therapists ?? []}
          appointments={appointments ?? []}
          onRegister={handleRegister}
          isSubmitting={
            createTherapistAbsence.isPending ||
            createPatientCancellation.isPending
          }
        />
        <div>
          <h3 className="mb-4 text-lg font-semibold">Faltas registradas</h3>
          {isLoading && <LoadingState />}
          {isError && (
            <ErrorState
              message={
                error instanceof HttpError
                  ? error.message
                  : "Erro ao carregar faltas."
              }
            />
          )}
          {absences && <AbsencesList absences={absences} />}
        </div>
      </div>
    </AppShell>
  );
}
