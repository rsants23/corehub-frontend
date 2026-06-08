import { apiService } from "@/services/api";
import { WEEKDAYS } from "@/utils/date";
import { mapFixedSchedule } from "@/utils/mappers";
import type {
  CreateFixedSchedulePayload,
  UpdateFixedSchedulePayload,
} from "@/types/api";
import type { Appointment } from "@/types";

export const schedulesService = {
  async listFixedSchedules(): Promise<Appointment[]> {
    const results = await Promise.all(
      WEEKDAYS.map((day) => apiService.schedules.listFixedByDay(day)),
    );
    return results.flat().map(mapFixedSchedule);
  },
  async createFixed(payload: CreateFixedSchedulePayload): Promise<Appointment> {
    const data = await apiService.schedules.createFixed(payload);
    return mapFixedSchedule(data);
  },
  async updateFixed(
    id: string,
    payload: UpdateFixedSchedulePayload,
  ): Promise<Appointment> {
    const data = await apiService.schedules.updateFixed(id, payload);
    return mapFixedSchedule(data);
  },
  async removeFixed(id: string): Promise<Appointment> {
    const data = await apiService.schedules.removeFixed(id);
    return mapFixedSchedule(data);
  },
  async generateDaily(date: string) {
    return apiService.schedules.generateDaily(date);
  },
  async getDaily(date: string) {
    return apiService.schedules.getDaily(date);
  },
  async getFreeSlots(date: string) {
    return apiService.schedules.getFreeSlots(date);
  },
};
