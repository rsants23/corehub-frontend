"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";

interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
  createdAt: string;
  user: { name: string; email: string };
}

export const auditService = {
  list: () => httpClient.get<AuditLogEntry[]>(API_ENDPOINTS.auditLogs),
};

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: () => auditService.list(),
  });
}
