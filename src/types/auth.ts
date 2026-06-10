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

export interface ClinicLoginOption {
  membershipId: string;
  clinicId: string;
  tenantId: string;
  tradeName: string;
  legalName: string;
  role: UserRole;
  available: boolean;
  blockReason?: string;
}

export interface AuthUser {
  id: string;
  identityId?: string;
  membershipId?: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  tenantId: string;
  clinicId: string;
  therapistId?: string | null;
  patientId?: string | null;
  clinic?: AuthClinic;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface SelectClinicPayload {
  selectionToken: string;
  clinicId: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
  user: Omit<AuthUser, "clinic">;
}

export interface LoginSelectionResponse {
  requiresClinicSelection: true;
  selectionToken: string;
  clinics: ClinicLoginOption[];
  identity: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
}

export type LoginResponse = LoginSuccessResponse | LoginSelectionResponse;

export function isLoginSelectionResponse(
  response: LoginResponse,
): response is LoginSelectionResponse {
  return "requiresClinicSelection" in response && response.requiresClinicSelection;
}

export interface MeResponse extends AuthUser {
  clinic: AuthClinic;
}

export interface IdentityExistsErrorBody {
  code: "IDENTITY_EXISTS";
  message: string;
  identity: {
    id: string;
    name: string;
    email: string;
    username: string | null;
  };
}

/** @deprecated Login legado */
export interface LegacyLoginPayload {
  cnpj: string;
  email: string;
  password: string;
}
