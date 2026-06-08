"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { reschedulingService } from "@/modules/remanejamento/services/rescheduling.service";

export function useRescheduleSuggestions(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.suggestions(date),
    queryFn: () => reschedulingService.listSuggestions(date),
  });
}

export function useReschedulingMutations(date: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suggestions(date) });

  const generate = useMutation({
    mutationFn: () => reschedulingService.generateSuggestions(date),
    onSuccess: invalidate,
  });

  const accept = useMutation({
    mutationFn: (id: string) => reschedulingService.accept(id, date),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: (id: string) => reschedulingService.reject(id, date),
    onSuccess: invalidate,
  });

  return { generate, accept, reject };
}
