import { apiService } from "@/services/api";
import { therapistsMock } from "@/modules/terapeutas/mocks/therapists.mock";
import type { Therapist } from "@/types";

const USE_MOCK = true;

export const therapistsService = {
  async list(): Promise<Therapist[]> {
    if (USE_MOCK) return therapistsMock;
    return apiService.therapists.list();
  },
};
