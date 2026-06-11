import { formatDate, formatDayOfWeek, formatTime } from "@/utils/format";
import type {
  ApiAbsenceRecord,
  ApiAppointment,
  ApiCancellation,
  ApiFixedSchedule,
  ApiPatient,
  ApiRescheduleSuggestion,
  ApiTherapist,
  ApiTherapyType,
} from "@/types/api";
import type {
  Absence,
  Appointment,
  Patient,
  RescheduleSuggestion,
  Therapist,
  TherapyType,
} from "@/types";

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function mapPatient(api: ApiPatient): Patient {
  return {
    id: api.id,
    name: api.name,
    birthDate: api.birthDate?.slice(0, 10),
    notes: api.notes ?? undefined,
    status: api.active ? "active" : "inactive",
  };
}

export function mapTherapist(api: ApiTherapist): Therapist {
  const specialties =
    api.skills?.map((s) => s.therapyType.name).join(", ") ?? "—";

  let weeklyHours = 0;
  api.availabilities?.forEach((a) => {
    weeklyHours +=
      (parseTimeToMinutes(a.endTime) - parseTimeToMinutes(a.startTime)) / 60;
  });

  return {
    id: api.id,
    name: api.name,
    specialty: specialties,
    weeklyHours: Math.round(weeklyHours),
    status: api.active ? "active" : "inactive",
    email: api.email ?? undefined,
    phone: api.phone ?? undefined,
  };
}

export function mapFixedSchedule(api: ApiFixedSchedule): Appointment {
  const endMinutes =
    parseTimeToMinutes(api.startTime) + api.durationMinutes;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

  return {
    id: api.id,
    patientId: api.patientId,
    patientName: api.patient.name,
    therapistId: api.therapistId,
    therapistName: api.therapist.name,
    therapyType: api.therapyType.name,
    therapyTypeId: api.therapyTypeId,
    dayOfWeek: api.dayOfWeek,
    startTime: api.startTime,
    endTime,
    durationMinutes: api.durationMinutes,
    notes: api.notes ?? undefined,
    status: api.active ? "SCHEDULED" : "CANCELLED_PATIENT",
  };
}

export function mapDailyAppointment(api: ApiAppointment): Appointment {
  return {
    id: api.id,
    patientId: api.patientId,
    patientName: api.patient.name,
    therapistId: api.therapistId,
    therapistName: api.therapist.name,
    therapyType: api.therapyType.name,
    startTime: formatTimeFromIso(api.startTime),
    endTime: formatTimeFromIso(api.endTime),
    status: api.status,
  };
}

export function mapAbsenceRecord(api: ApiAbsenceRecord): Absence {
  const dateStr =
    typeof api.date === "string" ? api.date.slice(0, 10) : String(api.date);
  return {
    id: api.id,
    type: "therapist",
    date: dateStr,
    name: api.therapist.name,
    reason: api.reason ?? "Não informado",
    notes: api.fullDay ? "Dia inteiro" : "Sessão específica",
  };
}

export function mapCancellation(api: ApiCancellation): Absence {
  const dateStr =
    typeof api.date === "string" ? api.date.slice(0, 10) : String(api.date);
  return {
    id: api.id,
    type: "patient",
    date: dateStr,
    name: api.patient.name,
    reason: api.reason ?? "Não informado",
    notes: `${api.appointment.therapyType.name} — ${formatTimeFromIso(api.appointment.startTime)}`,
  };
}

const REASON_LABELS: Record<string, string> = {
  THERAPIST_ABSENCE: "Ausência de terapeuta",
  PATIENT_CANCELLATION_RECOVERY: "Recuperação de cancelamento",
  SLOT_OPTIMIZATION: "Otimização de slot",
};

export function mapRescheduleSuggestion(
  api: ApiRescheduleSuggestion,
): RescheduleSuggestion {
  const originalTime = formatTimeFromIso(api.originalStartTime);
  return {
    id: api.id,
    affectedPatient: api.patientName,
    cancelledAppointment: `${api.therapyTypeName} — ${originalTime} (${api.originalTherapistName})`,
    suggestedTime: `${formatTimeFromIso(api.suggestedStartTime)} — ${formatTimeFromIso(api.suggestedEndTime)}`,
    suggestedTherapist: api.suggestedTherapistName,
    confidenceLevel: Math.min(100, Math.round(api.score)),
    reason: api.reason,
    reasonLabel: REASON_LABELS[api.reason] ?? api.reason,
    reasonDetail: api.reasonDetail ?? undefined,
    status: api.status,
  };
}

export function mapTherapyType(api: ApiTherapyType): TherapyType {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? undefined,
    durationMinutes: api.durationMinutes,
  };
}

function formatTimeFromIso(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatScheduleLabel(dayOfWeek?: string, start?: string, end?: string): string {
  if (!dayOfWeek || !start) return "";
  return `${formatDayOfWeek(dayOfWeek)} ${formatTime(start)}${end ? ` às ${formatTime(end)}` : ""}`;
}

export { formatDate };
