"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { schedulesService } from "@/modules/agendas/services/schedules.service";
import { getTodayDate } from "@/utils/date";
import type {
  CreateFixedSchedulePayload,
  UpdateFixedSchedulePayload,
} from "@/types/api";

export const appointmentsQueryKeys = {
  fixed: QUERY_KEYS.fixedSchedules,
  daily: (date: string) => QUERY_KEYS.dailySchedule(date),
  freeSlots: (date: string) => QUERY_KEYS.freeSlots(date),
} as const;

export function useFixedSchedulesQuery() {
  return useQuery({
    queryKey: appointmentsQueryKeys.fixed,
    queryFn: () => schedulesService.listFixedSchedules(),
  });
}

export function useDailyScheduleQuery(date: string) {
  return useQuery({
    queryKey: appointmentsQueryKeys.daily(date),
    queryFn: () => schedulesService.getDaily(date),
    enabled: Boolean(date),
  });
}

export function useScheduleMutations() {
  const queryClient = useQueryClient();
  const today = getTodayDate();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: appointmentsQueryKeys.fixed });
    queryClient.invalidateQueries({
      queryKey: appointmentsQueryKeys.daily(today),
    });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(today) });
  };

  const createFixed = useMutation({
    mutationFn: (payload: CreateFixedSchedulePayload) =>
      schedulesService.createFixed(payload),
    onSuccess: invalidate,
  });

  const updateFixed = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFixedSchedulePayload;
    }) => schedulesService.updateFixed(id, payload),
    onSuccess: invalidate,
  });

  const removeFixed = useMutation({
    mutationFn: (id: string) => schedulesService.removeFixed(id),
    onSuccess: invalidate,
  });

  const generateDaily = useMutation({
    mutationFn: (date: string) => schedulesService.generateDaily(date),
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({
        queryKey: appointmentsQueryKeys.daily(date),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(date) });
    },
  });

  return { createFixed, updateFixed, removeFixed, generateDaily };
}
