"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import {
  consentsService,
  type CreateConsentPayload,
} from "@/modules/consents/services/consents.service";

export function useConsentsQuery(patientId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.consents(patientId),
    queryFn: () => consentsService.list(patientId),
  });
}

export function useConsentMutations(patientId?: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consents() });
    if (patientId) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.consents(patientId),
      });
    }
  };

  const create = useMutation({
    mutationFn: (payload: CreateConsentPayload) =>
      consentsService.create(payload),
    onSuccess: invalidate,
  });

  const revoke = useMutation({
    mutationFn: (id: string) => consentsService.revoke(id),
    onSuccess: invalidate,
  });

  return { create, revoke };
}
