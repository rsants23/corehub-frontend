import { apiService } from "@/services/api";
import { appointmentsMock } from "@/modules/agendas/mocks/appointments.mock";
import type { Appointment } from "@/types";

const USE_MOCK = true;

export const schedulesService = {
  async list(): Promise<Appointment[]> {
    if (USE_MOCK) return appointmentsMock;
    return apiService.schedules.listDaily(new Date().toISOString().slice(0, 10));
  },
};
