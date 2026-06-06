import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type {
  Absence,
  Appointment,
  Patient,
  RescheduleSuggestion,
  Therapist,
} from "@/types";

export const apiService = {
  patients: {
    list: () => httpClient.get<Patient[]>(API_ENDPOINTS.patients),
    getById: (id: string) =>
      httpClient.get<Patient>(`${API_ENDPOINTS.patients}/${id}`),
    create: (data: Partial<Patient>) =>
      httpClient.post<Patient>(API_ENDPOINTS.patients, data),
    update: (id: string, data: Partial<Patient>) =>
      httpClient.patch<Patient>(`${API_ENDPOINTS.patients}/${id}`, data),
    remove: (id: string) =>
      httpClient.delete<void>(`${API_ENDPOINTS.patients}/${id}`),
  },
  therapists: {
    list: () => httpClient.get<Therapist[]>(API_ENDPOINTS.therapists),
    getById: (id: string) =>
      httpClient.get<Therapist>(`${API_ENDPOINTS.therapists}/${id}`),
    create: (data: Partial<Therapist>) =>
      httpClient.post<Therapist>(API_ENDPOINTS.therapists, data),
    update: (id: string, data: Partial<Therapist>) =>
      httpClient.patch<Therapist>(`${API_ENDPOINTS.therapists}/${id}`, data),
    remove: (id: string) =>
      httpClient.delete<void>(`${API_ENDPOINTS.therapists}/${id}`),
  },
  schedules: {
    listDaily: (date: string) =>
      httpClient.get<Appointment[]>(
        `${API_ENDPOINTS.schedules.daily}?date=${date}`,
      ),
    listFreeSlots: (date: string) =>
      httpClient.get<Appointment[]>(
        `${API_ENDPOINTS.schedules.freeSlots}?date=${date}`,
      ),
  },
  absences: {
    list: (date: string) =>
      httpClient.get<Absence[]>(`${API_ENDPOINTS.absences}?date=${date}`),
    create: (data: Partial<Absence>) =>
      httpClient.post<Absence>(API_ENDPOINTS.absences, data),
  },
  rescheduling: {
    simulate: (date: string) =>
      httpClient.post<RescheduleSuggestion[]>(
        API_ENDPOINTS.rescheduling.simulate,
        { date },
      ),
    listSuggestions: (date: string) =>
      httpClient.get<RescheduleSuggestion[]>(
        `${API_ENDPOINTS.rescheduling.suggestions}?date=${date}`,
      ),
    accept: (id: string) =>
      httpClient.patch<RescheduleSuggestion>(
        `${API_ENDPOINTS.rescheduling.suggestions}/${id}/accept`,
        {},
      ),
    reject: (id: string) =>
      httpClient.patch<RescheduleSuggestion>(
        `${API_ENDPOINTS.rescheduling.suggestions}/${id}/reject`,
        {},
      ),
  },
};
