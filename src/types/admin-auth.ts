export type GlobalAdminRole = "SUPER_ADMIN" | "SUPPORT";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: GlobalAdminRole;
  lastLoginAt?: string | null;
}

export interface AdminLoginResponse {
  accessToken: string;
  user: AdminUser;
}
