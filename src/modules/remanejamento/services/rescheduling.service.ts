import { apiService } from "@/services/api";
import { rescheduleSuggestionsMock } from "@/modules/remanejamento/mocks/reschedule-suggestions.mock";
import type { RescheduleSuggestion } from "@/types";

const USE_MOCK = true;

export const reschedulingService = {
  async listSuggestions(): Promise<RescheduleSuggestion[]> {
    if (USE_MOCK) return rescheduleSuggestionsMock;
    return apiService.rescheduling.listSuggestions(
      new Date().toISOString().slice(0, 10),
    );
  },
  async generateSuggestions(): Promise<RescheduleSuggestion[]> {
    if (USE_MOCK) return rescheduleSuggestionsMock;
    return apiService.rescheduling.simulate(
      new Date().toISOString().slice(0, 10),
    );
  },
};
