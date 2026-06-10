import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  SelectClinicPayload,
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

  async getMe(token?: string): Promise<MeResponse> {
    return httpClient.get<MeResponse>(API_ENDPOINTS.auth.me, { token });
  },
};
