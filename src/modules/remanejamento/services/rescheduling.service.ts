import { apiService } from "@/services/api";
import { mapRescheduleSuggestion } from "@/utils/mappers";
import type { RescheduleSuggestion } from "@/types";

export const reschedulingService = {
  async listSuggestions(date: string): Promise<RescheduleSuggestion[]> {
    const data = await apiService.rescheduling.listSuggestions(date);
    return data.map(mapRescheduleSuggestion);
  },
  async generateSuggestions(date: string): Promise<RescheduleSuggestion[]> {
    const result = await apiService.rescheduling.generate(date);
    return result.suggestions.map(mapRescheduleSuggestion);
  },
  async accept(id: string, date: string): Promise<RescheduleSuggestion[]> {
    await apiService.rescheduling.approve(id);
    return this.listSuggestions(date);
  },
  async reject(id: string, date: string): Promise<RescheduleSuggestion[]> {
    await apiService.rescheduling.reject(id);
    return this.listSuggestions(date);
  },
  async apply(id: string, date: string): Promise<RescheduleSuggestion[]> {
    await apiService.rescheduling.apply(id);
    return this.listSuggestions(date);
  },
};
