import { apiService } from "@/services/api";
import { patientsMock } from "@/modules/pacientes/mocks/patients.mock";
import type { Patient } from "@/types";

const USE_MOCK = true;

export const patientsService = {
  async list(): Promise<Patient[]> {
    if (USE_MOCK) return patientsMock;
    return apiService.patients.list();
  },
  async getById(id: string): Promise<Patient | undefined> {
    if (USE_MOCK) return patientsMock.find((p) => p.id === id);
    return apiService.patients.getById(id);
  },
};
