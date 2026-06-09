import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";

export interface ApiConsent {
  id: string;
  patientId: string;
  guardianName: string;
  purpose: string;
  version: string;
  status: "GRANTED" | "REVOKED";
  grantedAt: string;
  revokedAt: string | null;
  createdAt: string;
  patient: { id: string; name: string };
}

export interface CreateConsentPayload {
  patientId: string;
  guardianName: string;
  purpose: string;
  version: string;
}

export const consentsService = {
  list: (patientId?: string) => {
    const query = patientId ? `?patientId=${patientId}` : "";
    return httpClient.get<ApiConsent[]>(`${API_ENDPOINTS.consents}${query}`);
  },
  create: (data: CreateConsentPayload) =>
    httpClient.post<ApiConsent>(API_ENDPOINTS.consents, data),
  revoke: (id: string) =>
    httpClient.patch<ApiConsent>(`${API_ENDPOINTS.consents}/${id}/revoke`, {}),
};
