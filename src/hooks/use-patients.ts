"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { patientsService } from "@/modules/pacientes/services/patients.service";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/types/api";

export function usePatients() {
  return useQuery({
    queryKey: QUERY_KEYS.patients,
    queryFn: () => patientsService.list(),
  });
}

export function usePatientMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients });

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
