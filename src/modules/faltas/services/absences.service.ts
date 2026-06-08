import { apiService } from "@/services/api";
import {
  mapAbsenceRecord,
  mapCancellation,
  mapDailyAppointment,
} from "@/utils/mappers";
import type {
  CreateAbsencePayload,
  CreateCancellationPayload,
} from "@/types/api";
import type { Absence, Appointment } from "@/types";

export const absencesService = {
  async listByDate(date: string): Promise<Absence[]> {
    const [absences, cancellations] = await Promise.all([
      apiService.absences.list(date),
      apiService.cancellations.list(date),
    ]);
    return [
      ...absences.map(mapAbsenceRecord),
      ...cancellations.map(mapCancellation),
    ];
  },
  async createTherapistAbsence(payload: CreateAbsencePayload): Promise<Absence> {
    const result = await apiService.absences.create(payload);
    return mapAbsenceRecord(result.absence);
  },
  async createPatientCancellation(
    payload: CreateCancellationPayload,
  ): Promise<Absence> {
    const result = await apiService.cancellations.create(payload) as {
      cancellation: import("@/types/api").ApiCancellation;
    };
    return mapCancellation(result.cancellation);
  },
  async getDailyAppointments(date: string): Promise<Appointment[]> {
    try {
      const daily = await apiService.schedules.getDaily(date);
      return daily.appointments
        .filter((a) => a.status === "SCHEDULED")
        .map(mapDailyAppointment);
    } catch {
      return [];
    }
  },
};
