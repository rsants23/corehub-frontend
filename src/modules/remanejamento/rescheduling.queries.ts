"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { reschedulingService } from "@/modules/remanejamento/services/rescheduling.service";

export const reschedulingQueryKeys = {
  suggestions: (date: string) => QUERY_KEYS.suggestions(date),
} as const;

export function useRescheduleSuggestionsQuery(date: string) {
  return useQuery({
    queryKey: reschedulingQueryKeys.suggestions(date),
    queryFn: () => reschedulingService.listSuggestions(date),
    enabled: Boolean(date),
  });
}

export function useReschedulingMutations(date: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: reschedulingQueryKeys.suggestions(date),
    });

  const generate = useMutation({
    mutationFn: () => reschedulingService.generateSuggestions(date),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(date) });
    },
  });

  const accept = useMutation({
    mutationFn: (id: string) => reschedulingService.accept(id, date),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: (id: string) => reschedulingService.reject(id, date),
    onSuccess: invalidate,
  });

  const apply = useMutation({
    mutationFn: (id: string) => reschedulingService.apply(id, date),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dailySchedule(date),
      });
    },
  });

  return { generate, accept, reject, apply };
}
