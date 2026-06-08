"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { therapistsService } from "@/modules/terapeutas/services/therapists.service";
import type {
  CreateTherapistPayload,
  UpdateTherapistPayload,
} from "@/types/api";

export function useTherapists() {
  return useQuery({
    queryKey: QUERY_KEYS.therapists,
    queryFn: () => therapistsService.list(),
  });
}

export function useTherapistMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.therapists });

  const create = useMutation({
    mutationFn: (payload: CreateTherapistPayload) =>
      therapistsService.create(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTherapistPayload;
    }) => therapistsService.update(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => therapistsService.remove(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
