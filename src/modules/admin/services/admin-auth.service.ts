import { API_ENDPOINTS } from "@/constants/api";
import { adminHttpClient } from "@/services/admin-http-client";
import type { AdminLoginResponse, AdminUser } from "@/types/admin-auth";

export const adminAuthService = {
  login(email: string, password: string) {
    return adminHttpClient.post<AdminLoginResponse>(
      API_ENDPOINTS.admin.login,
      { email: email.toLowerCase(), password },
      { skipAuth: true },
    );
  },

  getMe(token?: string) {
    return adminHttpClient.get<AdminUser>(API_ENDPOINTS.admin.me, { token });
  },
};
