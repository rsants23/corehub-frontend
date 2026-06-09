export type UserRole =
  | "ADMIN"
  | "COORDINATOR"
  | "RECEPTION"
  | "THERAPIST"
  | "PATIENT"
  | "GUARDIAN";

export interface AuthClinic {
  tradeName: string;
  legalName: string;
  status: string;
  cnpj: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  tenantId: string;
  clinicId: string;
  clinic?: AuthClinic;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

/** @deprecated Login legado — CNPJ + e-mail + senha */
export interface LegacyLoginPayload {
  cnpj: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Omit<AuthUser, "clinic">;
}

export interface MeResponse extends AuthUser {
  clinic: AuthClinic;
}
