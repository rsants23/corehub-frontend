import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  MembershipSummary,
  SelectClinicPayload,
  SwitchClinicPayload,
  LoginSuccessResponse,
} from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      payload,
      { skipAuth: true },
    );
  },

  async selectClinic(
    payload: SelectClinicPayload,
  ): Promise<LoginSuccessResponse> {
    return httpClient.post<LoginSuccessResponse>(
      API_ENDPOINTS.auth.selectClinic,
      payload,
      { skipAuth: true },
    );
  },

  async getMe(): Promise<MeResponse> {
    return httpClient.get<MeResponse>(API_ENDPOINTS.auth.me);
  },

  async getMemberships(): Promise<MembershipSummary[]> {
    return httpClient.get<MembershipSummary[]>(API_ENDPOINTS.auth.memberships);
  },

  async switchClinic(
    payload: SwitchClinicPayload,
  ): Promise<LoginSuccessResponse> {
    return httpClient.post<LoginSuccessResponse>(
      API_ENDPOINTS.auth.switchClinic,
      payload,
    );
  },

  async logout(): Promise<void> {
    await httpClient.post(API_ENDPOINTS.auth.logout, {});
  },
};
