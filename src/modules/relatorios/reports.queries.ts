"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import {
  dashboardService,
  reportsService,
} from "@/modules/relatorios/services/reports.service";

export const reportsQueryKeys = {
  dashboard: (date: string) => QUERY_KEYS.dashboard(date),
  metrics: (date: string) => QUERY_KEYS.reports(date),
} as const;

export function useDashboardQuery(date: string) {
  return useQuery({
    queryKey: reportsQueryKeys.dashboard(date),
    queryFn: () => dashboardService.getStats(date),
    enabled: Boolean(date),
  });
}

export function useReportsQuery(date: string) {
  return useQuery({
    queryKey: reportsQueryKeys.metrics(date),
    queryFn: () => reportsService.getMetrics(date),
    enabled: Boolean(date),
  });
}
