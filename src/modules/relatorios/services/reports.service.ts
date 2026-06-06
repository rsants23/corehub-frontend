import { reportMetricsMock } from "@/modules/relatorios/mocks/reports.mock";
import type { ReportMetrics } from "@/types";

const USE_MOCK = true;

export const reportsService = {
  async getMetrics(): Promise<ReportMetrics> {
    if (USE_MOCK) return reportMetricsMock;
    return reportMetricsMock;
  },
};
