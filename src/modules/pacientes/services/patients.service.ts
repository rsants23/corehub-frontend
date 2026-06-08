import { apiService } from "@/services/api";
import { mapPatient } from "@/utils/mappers";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/types/api";
import type { Patient } from "@/types";

export const patientsService = {
  async list(): Promise<Patient[]> {
    const data = await apiService.patients.list();
    return data.map(mapPatient);
  },
  async getById(id: string): Promise<Patient> {
    const data = await apiService.patients.getById(id);
    return mapPatient(data);
  },
  async create(payload: CreatePatientPayload): Promise<Patient> {
    const data = await apiService.patients.create(payload);
    return mapPatient(data);
  },
  async update(id: string, payload: UpdatePatientPayload): Promise<Patient> {
    const data = await apiService.patients.update(id, payload);
    return mapPatient(data);
  },
  async remove(id: string): Promise<void> {
    await apiService.patients.remove(id);
  },
};
