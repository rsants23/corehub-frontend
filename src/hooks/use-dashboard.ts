"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { dashboardService } from "@/modules/relatorios/services/reports.service";

export function useDashboard(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard(date),
    queryFn: () => dashboardService.getStats(date),
  });
}
