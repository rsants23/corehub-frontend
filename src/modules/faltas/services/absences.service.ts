import { apiService } from "@/services/api";
import { absencesMock } from "@/modules/faltas/mocks/absences.mock";
import type { Absence } from "@/types";

const USE_MOCK = true;

export const absencesService = {
  async list(): Promise<Absence[]> {
    if (USE_MOCK) return absencesMock;
    return apiService.absences.list(new Date().toISOString().slice(0, 10));
  },
};
