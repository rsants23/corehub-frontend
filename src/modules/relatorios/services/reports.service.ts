import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type { DashboardStats, ReportMetrics } from "@/types";

interface ApiDashboardResponse {
  date: string;
  patientsToday: number;
  therapistsPresent: number;
  absencesRegistered: number;
  freeSlots: number;
  suggestedReschedules: number;
  occupancyRate: number;
  scheduledAppointments?: number;
}

interface ApiOccupancyResponse {
  date: string;
  therapistOccupancy: { name: string; rate: number }[];
  overallRate: number;
  absenceImpactRate: number;
}

export const dashboardService = {
  async getStats(date: string): Promise<DashboardStats> {
    const data = await httpClient.get<ApiDashboardResponse>(
      `${API_ENDPOINTS.reports.dashboard}?date=${date}`,
    );
    return {
      patientsToday: data.patientsToday,
      therapistsPresent: data.therapistsPresent,
      absencesRegistered: data.absencesRegistered,
      freeSlots: data.freeSlots,
      suggestedReschedules: data.suggestedReschedules,
      occupancyRate: data.occupancyRate,
    };
  },
};

export const reportsService = {
  async getMetrics(date: string): Promise<ReportMetrics> {
    const occupancy = await httpClient.get<ApiOccupancyResponse>(
      `${API_ENDPOINTS.reports.occupancy}?date=${date}`,
    );

    await httpClient.get<{ total: number }>(
      `${API_ENDPOINTS.reports.absences}?date=${date}`,
    );

    const suggestions = await httpClient.get<{ status: string }[]>(
      `${API_ENDPOINTS.rescheduling.suggestions}?date=${date}`,
    ).catch(() => [] as { status: string }[]);

    const recoveredAppointments = suggestions.filter(
      (s) => s.status === "APPROVED" || s.status === "ACCEPTED" || s.status === "APPLIED",
    ).length;

    return {
      absenceRate: occupancy.absenceImpactRate,
      idleHours: 0,
      recoveredAppointments,
      therapistOccupancy: occupancy.therapistOccupancy.map((t) => ({
        name: t.name.split(" ")[1] ?? t.name,
        rate: t.rate,
      })),
    };
  },
};
