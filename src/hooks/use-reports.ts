"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { reportsService } from "@/modules/relatorios/services/reports.service";

export function useReports(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.reports(date),
    queryFn: () => reportsService.getMetrics(date),
  });
}
