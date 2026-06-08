"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { absencesService } from "@/modules/faltas/services/absences.service";
import type {
  CreateAbsencePayload,
  CreateCancellationPayload,
} from "@/types/api";

export const absencesQueryKeys = {
  list: (date: string) => QUERY_KEYS.absences(date),
  daily: (date: string) => QUERY_KEYS.dailySchedule(date),
} as const;

export function useAbsencesQuery(date: string) {
  return useQuery({
    queryKey: absencesQueryKeys.list(date),
    queryFn: () => absencesService.listByDate(date),
    enabled: Boolean(date),
  });
}

export function useDailyAppointmentsQuery(date: string) {
  return useQuery({
    queryKey: absencesQueryKeys.daily(date),
    queryFn: () => absencesService.getDailyAppointments(date),
    enabled: Boolean(date),
  });
}

export function useAbsenceMutations(date: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: absencesQueryKeys.list(date) });
    queryClient.invalidateQueries({ queryKey: absencesQueryKeys.daily(date) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(date) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports(date) });
  };

  const createTherapistAbsence = useMutation({
    mutationFn: (payload: CreateAbsencePayload) =>
      absencesService.createTherapistAbsence(payload),
    onSuccess: invalidate,
  });

  const createPatientCancellation = useMutation({
    mutationFn: (payload: CreateCancellationPayload) =>
      absencesService.createPatientCancellation(payload),
    onSuccess: invalidate,
  });

  return { createTherapistAbsence, createPatientCancellation };
}
