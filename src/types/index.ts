export type EntityStatus = "active" | "inactive";

export type AbsenceType = "patient" | "therapist";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CANCELLED_PATIENT"
  | "CANCELLED_THERAPIST"
  | "RESCHEDULED"
  | "COMPLETED";

export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "APPLIED";

export interface Patient {
  id: string;
  name: string;
  birthDate?: string;
  notes?: string;
  status: EntityStatus;
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
  therapyTypeId?: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  notes?: string;
  status: string;
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
  status: string;
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

export interface TherapyType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
}
