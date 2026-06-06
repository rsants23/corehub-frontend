import type { DashboardStats, ReportMetrics } from "@/types";

export const dashboardStatsMock: DashboardStats = {
  patientsToday: 18,
  therapistsPresent: 7,
  absencesRegistered: 3,
  freeSlots: 5,
  suggestedReschedules: 4,
  occupancyRate: 82.5,
};

export const reportMetricsMock: ReportMetrics = {
  absenceRate: 8.4,
  idleHours: 12,
  recoveredAppointments: 14,
  therapistOccupancy: [
    { name: "Camila N.", rate: 88 },
    { name: "Rafael L.", rate: 76 },
    { name: "Juliana F.", rate: 91 },
    { name: "Bruno C.", rate: 62 },
    { name: "Patrícia M.", rate: 45 },
  ],
};
