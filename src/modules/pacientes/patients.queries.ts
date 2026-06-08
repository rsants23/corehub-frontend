"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { patientsService } from "@/modules/pacientes/services/patients.service";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/types/api";

export const patientsQueryKeys = {
  all: QUERY_KEYS.patients,
  detail: (id: string) => QUERY_KEYS.patient(id),
} as const;

export function usePatientsQuery() {
  return useQuery({
    queryKey: patientsQueryKeys.all,
    queryFn: () => patientsService.list(),
  });
}

export function usePatientQuery(id: string) {
  return useQuery({
    queryKey: patientsQueryKeys.detail(id),
    queryFn: () => patientsService.getById(id),
    enabled: Boolean(id),
  });
}

export function usePatientMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: patientsQueryKeys.all });

  const create = useMutation({
    mutationFn: (payload: CreatePatientPayload) =>
      patientsService.create(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePatientPayload;
    }) => patientsService.update(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => patientsService.remove(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
