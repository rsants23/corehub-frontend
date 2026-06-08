"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { schedulesService } from "@/modules/agendas/services/schedules.service";
import { getTodayDate } from "@/utils/date";
import type {
  CreateFixedSchedulePayload,
  UpdateFixedSchedulePayload,
} from "@/types/api";

export function useFixedSchedules() {
  return useQuery({
    queryKey: QUERY_KEYS.fixedSchedules,
    queryFn: () => schedulesService.listFixedSchedules(),
  });
}

export function useScheduleMutations() {
  const queryClient = useQueryClient();
  const today = getTodayDate();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fixedSchedules });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailySchedule(today) });
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
        queryKey: QUERY_KEYS.dailySchedule(date),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(date) });
    },
  });

  return { createFixed, updateFixed, removeFixed, generateDaily };
}
