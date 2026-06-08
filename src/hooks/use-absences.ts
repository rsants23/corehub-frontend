"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { absencesService } from "@/modules/faltas/services/absences.service";
import type {
  CreateAbsencePayload,
  CreateCancellationPayload,
} from "@/types/api";

export function useAbsences(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.absences(date),
    queryFn: () => absencesService.listByDate(date),
  });
}

export function useDailyAppointments(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dailySchedule(date),
    queryFn: () => absencesService.getDailyAppointments(date),
  });
}

export function useAbsenceMutations(date: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.absences(date) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailySchedule(date) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(date) });
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
