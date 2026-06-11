import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type { DashboardStats, ReportMetrics, ReschedulingOpportunities } from "@/types";

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

interface ApiReschedulingMetricsResponse {
  date: string;
  recoveredHours: number;
  recoveredAppointments: number;
  pendingSuggestions: number;
  scheduleOccupancyRate: number;
  idleHours: number;
  therapistOccupancy: { name: string; rate: number }[];
  absenceImpactRate: number;
}

interface ApiOpportunitiesResponse {
  date: string;
  total: number;
  impactMinutes: number;
  utilizationGainPercent: number;
  byReason: ReschedulingOpportunities["byReason"];
}

interface ApiOccupancyResponse {
  date: string;
  therapistOccupancy: { name: string; rate: number }[];
  overallRate: number;
  absenceImpactRate: number;
}

export const dashboardService = {
  async getStats(date: string): Promise<DashboardStats> {
    const [data, opportunities] = await Promise.all([
      httpClient.get<ApiDashboardResponse>(
        `${API_ENDPOINTS.reports.dashboard}?date=${date}`,
      ),
      httpClient
        .get<ApiOpportunitiesResponse>(
          `${API_ENDPOINTS.rescheduling.opportunities}?date=${date}`,
        )
        .catch(() => null),
    ]);

    return {
      patientsToday: data.patientsToday,
      therapistsPresent: data.therapistsPresent,
      absencesRegistered: data.absencesRegistered,
      freeSlots: data.freeSlots,
      suggestedReschedules: data.suggestedReschedules,
      occupancyRate: data.occupancyRate,
      reschedulingOpportunities: opportunities ?? undefined,
    };
  },
};

export const reportsService = {
  async getMetrics(date: string): Promise<ReportMetrics> {
    const metrics = await httpClient.get<ApiReschedulingMetricsResponse>(
      `${API_ENDPOINTS.reports.rescheduling}?date=${date}`,
    );

    return {
      absenceRate: metrics.absenceImpactRate,
      idleHours: metrics.idleHours,
      recoveredAppointments: metrics.recoveredAppointments,
      recoveredHours: metrics.recoveredHours,
      scheduleOccupancyRate: metrics.scheduleOccupancyRate,
      therapistOccupancy: metrics.therapistOccupancy.map((t) => ({
        name: t.name.split(" ")[1] ?? t.name,
        rate: t.rate,
      })),
    };
  },
};
