export type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CANCELLED_PATIENT"
  | "CANCELLED_THERAPIST"
  | "RESCHEDULED"
  | "COMPLETED";

export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "APPLIED";

export interface ApiPatient {
  id: string;
  name: string;
  birthDate: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTherapyType {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  active: boolean;
}

export interface ApiTherapistAvailability {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface ApiTherapistSkill {
  id: string;
  therapyTypeId: string;
  therapyType: ApiTherapyType;
}

export interface ApiTherapist {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  availabilities?: ApiTherapistAvailability[];
  skills?: ApiTherapistSkill[];
}

export interface ApiFixedSchedule {
  id: string;
  patientId: string;
  therapistId: string;
  therapyTypeId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  durationMinutes: number;
  active: boolean;
  notes: string | null;
  patient: { id: string; name: string };
  therapist: { id: string; name: string };
  therapyType: ApiTherapyType;
}

export interface ApiAppointment {
  id: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  patientId: string;
  therapistId: string;
  therapyTypeId: string;
  patient: { id: string; name: string };
  therapist: { id: string; name: string };
  therapyType: { id: string; name: string };
}

export interface ApiDailySchedule {
  id: string;
  date: string;
  generated: boolean;
  appointments: ApiAppointment[];
}

export interface ApiAbsenceRecord {
  id: string;
  therapistId: string;
  date: string;
  reason: string | null;
  fullDay: boolean;
  therapist: { id: string; name: string };
  appointment?: {
    id: string;
    patient: { name: string };
    therapyType: { name: string };
  } | null;
}

export interface ApiCancellation {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  reason: string | null;
  patient: { id: string; name: string };
  appointment: {
    id: string;
    startTime: string;
    therapist: { name: string };
    therapyType: { name: string };
  };
}

export interface ApiRescheduleSuggestion {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  therapyTypeName: string;
  originalTherapistName: string;
  suggestedTherapistName: string;
  originalStartTime: string;
  originalEndTime: string;
  suggestedStartTime: string;
  suggestedEndTime: string;
  score: number;
  status: SuggestionStatus;
  reason: string;
  reasonDetail: string | null;
}

export interface ApiSimulateResponse {
  date: string;
  summary: {
    impactedByTherapistAbsence: number;
    cancelledByPatient: number;
    patientsNeedingReschedule: number;
    freeSlots: number;
    suggestionsGenerated: number;
  };
  suggestions: ApiRescheduleSuggestion[];
}

export interface ApiFreeSlot {
  therapistId: string;
  therapistName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface CreatePatientPayload {
  name: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdatePatientPayload {
  name?: string;
  birthDate?: string;
  notes?: string;
  active?: boolean;
}

export interface CreateTherapistPayload {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateTherapistPayload {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface CreateAbsencePayload {
  therapistId: string;
  date: string;
  appointmentId?: string;
  fullDay?: boolean;
  reason?: string;
}

export interface CreateCancellationPayload {
  patientId: string;
  appointmentId: string;
  date: string;
  reason?: string;
}

export interface CreateFixedSchedulePayload {
  patientId: string;
  therapistId: string;
  therapyTypeId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  durationMinutes?: number;
  notes?: string;
}

export interface UpdateFixedSchedulePayload {
  patientId?: string;
  therapistId?: string;
  therapyTypeId?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
  active?: boolean;
}

export interface CreateTherapyTypePayload {
  name: string;
  description?: string;
  durationMinutes?: number;
}

export interface LinkTherapistSkillPayload {
  therapistId: string;
  therapyTypeId: string;
}
