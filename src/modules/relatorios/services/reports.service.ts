import { apiService } from "@/services/api";
import { mapDailyAppointment, mapTherapist } from "@/utils/mappers";
import type { DashboardStats, ReportMetrics } from "@/types";

export const dashboardService = {
  async getStats(date: string): Promise<DashboardStats> {
    const [therapists, absences, cancellations, suggestions] =
      await Promise.all([
        apiService.therapists.list(),
        apiService.absences.list(date).catch(() => []),
        apiService.cancellations.list(date).catch(() => []),
        apiService.rescheduling
          .listSuggestions(date, "PENDING")
          .catch(() => []),
      ]);

    let patientsToday = 0;
    let freeSlots = 0;
    let occupancyRate = 0;

    try {
      const daily = await apiService.schedules.getDaily(date);
      const scheduled = daily.appointments.filter(
        (a) => a.status === "SCHEDULED" || a.status === "RESCHEDULED",
      );
      patientsToday = new Set(scheduled.map((a) => a.patientId)).size;

      if (scheduled.length > 0 && therapists.length > 0) {
        occupancyRate = Math.min(
          100,
          (scheduled.length / (therapists.length * 8)) * 100,
        );
      }
    } catch {
      patientsToday = 0;
    }

    try {
      const slots = await apiService.schedules.getFreeSlots(date);
      freeSlots = slots.length;
    } catch {
      freeSlots = 0;
    }

    const absentTherapistIds = new Set(absences.map((a) => a.therapistId));

    return {
      patientsToday,
      therapistsPresent: therapists.length - absentTherapistIds.size,
      absencesRegistered: absences.length + cancellations.length,
      freeSlots,
      suggestedReschedules: suggestions.length,
      occupancyRate,
    };
  },
};

export const reportsService = {
  async getMetrics(date: string): Promise<ReportMetrics> {
    const [therapists, absences, cancellations, suggestions] =
      await Promise.all([
        apiService.therapists.list(),
        apiService.absences.list(date).catch(() => []),
        apiService.cancellations.list(date).catch(() => []),
        apiService.rescheduling.listSuggestions(date).catch(() => []),
      ]);

    let dailyAppointments: ReturnType<typeof mapDailyAppointment>[] = [];
    try {
      const daily = await apiService.schedules.getDaily(date);
      dailyAppointments = daily.appointments.map(mapDailyAppointment);
    } catch {
      dailyAppointments = [];
    }

    const totalAppointments = dailyAppointments.length || 1;
    const absenceRate =
      ((absences.length + cancellations.length) / totalAppointments) * 100;

    let idleHours = 0;
    try {
      const slots = await apiService.schedules.getFreeSlots(date);
      idleHours = Math.round(
        slots.reduce((acc, s) => acc + s.durationMinutes, 0) / 60,
      );
    } catch {
      idleHours = 0;
    }

    const recoveredAppointments = suggestions.filter(
      (s) => s.status === "APPLIED" || s.status === "ACCEPTED",
    ).length;

    const therapistOccupancy = therapists.map((t) => {
      const mapped = mapTherapist(t);
      const therapistAppts = dailyAppointments.filter(
        (a) => a.therapistName === mapped.name,
      );
      const rate =
        mapped.weeklyHours > 0
          ? Math.min(100, (therapistAppts.length / 8) * 100)
          : 0;
      return {
        name: mapped.name.split(" ")[1] ?? mapped.name,
        rate: Math.round(rate),
      };
    });

    return {
      absenceRate,
      idleHours,
      recoveredAppointments,
      therapistOccupancy,
    };
  },
};
