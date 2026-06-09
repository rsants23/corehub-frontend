export type TherapistAppointmentAction =
  | "CONFIRMED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELED";

export interface TherapistPortalMe {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  therapist: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    specialty: string | null;
    professionalRegister: string | null;
    status: string;
    active: boolean;
    skills: { id: string; name: string; durationMinutes: number }[];
  } | null;
  clinic: {
    id: string;
    tradeName: string;
    legalName: string;
    cnpj: string;
    status: string;
  } | null;
}

export interface TherapistAgendaItem {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  origin: string;
  notes: string | null;
  room: string | null;
  patient: { id: string; name: string };
  therapyType: { id: string; name: string };
}

export interface TherapistPatientSummary {
  id: string;
  name: string;
  birthDate: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  therapyTypes: { id: string; name: string }[];
  lastSession: { startTime: string; status: string } | null;
  nextAppointment: { startTime: string; status: string } | null;
}

export interface TherapistPatientDetail {
  patient: {
    id: string;
    name: string;
    birthDate: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianEmail: string | null;
  };
  therapyTypes: { id: string; name: string }[];
  upcomingAppointments: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    origin: string;
    therapyType: string;
  }[];
  history: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    therapyType: string;
  }[];
}

export interface PatientPortalMe {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  patients: {
    id: string;
    name: string;
    birthDate: string | null;
    relationship: string;
    isPrimary: boolean;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianEmail: string | null;
  }[];
  clinic: {
    id: string;
    tradeName: string;
    legalName: string;
    cnpj: string;
    phone: string | null;
    email: string | null;
    status: string;
  } | null;
}

export interface PatientPortalAgendaItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  origin: string;
  therapist: { id: string; name: string; specialty: string | null };
  therapyType: { id: string; name: string };
  publicNotes: string | null;
}

export interface PatientPortalConsent {
  id: string;
  patientId: string;
  guardianName: string;
  purpose: string;
  version: string;
  status: string;
  grantedAt: string;
  revokedAt: string | null;
  patient: { id: string; name: string };
}
