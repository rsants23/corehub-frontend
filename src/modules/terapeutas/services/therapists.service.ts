import { apiService } from "@/services/api";
import { mapTherapist } from "@/utils/mappers";
import type {
  CreateTherapistPayload,
  UpdateTherapistPayload,
} from "@/types/api";
import type { Therapist } from "@/types";

export const therapistsService = {
  async list(): Promise<Therapist[]> {
    const data = await apiService.therapists.list();
    return data.map(mapTherapist);
  },
  async create(payload: CreateTherapistPayload): Promise<Therapist> {
    const data = await apiService.therapists.create(payload);
    return mapTherapist(data);
  },
  async update(id: string, payload: UpdateTherapistPayload): Promise<Therapist> {
    const data = await apiService.therapists.update(id, payload);
    return mapTherapist(data);
  },
  async remove(id: string): Promise<void> {
    await apiService.therapists.remove(id);
  },
};
