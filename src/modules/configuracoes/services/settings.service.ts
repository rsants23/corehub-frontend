import { apiService } from "@/services/api";
import { mapTherapyType } from "@/utils/mappers";
import type { TherapyType } from "@/types";
import type {
  CreateTherapyTypePayload,
  LinkTherapistSkillPayload,
} from "@/types/api";

export const settingsService = {
  async listTherapyTypes(): Promise<TherapyType[]> {
    const data = await apiService.therapyTypes.list();
    return data.filter((t) => t.active).map(mapTherapyType);
  },

  async createTherapyType(
    payload: CreateTherapyTypePayload,
  ): Promise<TherapyType> {
    const created = await apiService.therapyTypes.create(payload);
    return mapTherapyType(created);
  },

  async linkTherapistSkill(payload: LinkTherapistSkillPayload) {
    return apiService.therapyTypes.linkSkill(payload);
  },

  async listTherapistSkills(therapistId: string) {
    return apiService.therapyTypes.listSkillsByTherapist(therapistId);
  },

  async getCounts() {
    const [patients, therapists, therapyTypes] = await Promise.all([
      apiService.patients.list(),
      apiService.therapists.list(),
      apiService.therapyTypes.list(),
    ]);
    return {
      patients: patients.length,
      therapists: therapists.length,
      therapyTypes: therapyTypes.length,
    };
  },
};
