export type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type EntityStatus = "active" | "inactive";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CANCELLED_PATIENT"
  | "CANCELLED_THERAPIST"
  | "RESCHEDULED"
  | "COMPLETED";

export type AbsenceType = "patient" | "therapist";

export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "APPLIED";

export interface Patient {
  id: string;
  name: string;
  guardianName: string;
  insurance: string;
  therapies: string[];
  status: EntityStatus;
  birthDate?: string;
  notes?: string;
}

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  weeklyHours: number;
  status: EntityStatus;
  email?: string;
  phone?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  therapyType: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export interface Absence {
  id: string;
  type: AbsenceType;
  date: string;
  name: string;
  reason: string;
  notes?: string;
}

export interface RescheduleSuggestion {
  id: string;
  affectedPatient: string;
  cancelledAppointment: string;
  suggestedTime: string;
  suggestedTherapist: string;
  confidenceLevel: number;
  status: SuggestionStatus;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: EntityStatus;
}

export interface DashboardStats {
  patientsToday: number;
  therapistsPresent: number;
  absencesRegistered: number;
  freeSlots: number;
  suggestedReschedules: number;
  occupancyRate: number;
}

export interface ReportMetrics {
  absenceRate: number;
  idleHours: number;
  recoveredAppointments: number;
  therapistOccupancy: { name: string; rate: number }[];
}
