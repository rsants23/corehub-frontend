import { API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type {
  ApiAbsenceRecord,
  ApiCancellation,
  ApiDailySchedule,
  ApiFixedSchedule,
  ApiFreeSlot,
  ApiPatient,
  ApiRescheduleSuggestion,
  ApiSimulateResponse,
  ApiTherapist,
  ApiTherapistSkill,
  ApiTherapyType,
  CreateAbsencePayload,
  CreateCancellationPayload,
  CreateFixedSchedulePayload,
  CreatePatientPayload,
  CreateTherapistPayload,
  CreateTherapyTypePayload,
  DayOfWeek,
  LinkTherapistSkillPayload,
  SuggestionStatus,
  UpdateFixedSchedulePayload,
  UpdatePatientPayload,
  UpdateTherapistPayload,
} from "@/types/api";

export const apiService = {
  patients: {
    list: () => httpClient.get<ApiPatient[]>(API_ENDPOINTS.patients),
    getById: (id: string) =>
      httpClient.get<ApiPatient>(`${API_ENDPOINTS.patients}/${id}`),
    create: (data: CreatePatientPayload) =>
      httpClient.post<ApiPatient>(API_ENDPOINTS.patients, data),
    update: (id: string, data: UpdatePatientPayload) =>
      httpClient.patch<ApiPatient>(`${API_ENDPOINTS.patients}/${id}`, data),
    remove: (id: string) =>
      httpClient.delete<ApiPatient>(`${API_ENDPOINTS.patients}/${id}`),
  },
  therapists: {
    list: () => httpClient.get<ApiTherapist[]>(API_ENDPOINTS.therapists),
    getById: (id: string) =>
      httpClient.get<ApiTherapist>(`${API_ENDPOINTS.therapists}/${id}`),
    create: (data: CreateTherapistPayload) =>
      httpClient.post<ApiTherapist>(API_ENDPOINTS.therapists, data),
    update: (id: string, data: UpdateTherapistPayload) =>
      httpClient.patch<ApiTherapist>(`${API_ENDPOINTS.therapists}/${id}`, data),
    remove: (id: string) =>
      httpClient.delete<ApiTherapist>(`${API_ENDPOINTS.therapists}/${id}`),
  },
  therapyTypes: {
    list: () =>
      httpClient.get<ApiTherapyType[]>(API_ENDPOINTS.therapyTypes),
    create: (data: CreateTherapyTypePayload) =>
      httpClient.post<ApiTherapyType>(API_ENDPOINTS.therapyTypes, data),
    linkSkill: (data: LinkTherapistSkillPayload) =>
      httpClient.post(API_ENDPOINTS.therapyTypeSkills, data),
    listSkillsByTherapist: (therapistId: string) =>
      httpClient.get<ApiTherapistSkill[]>(
        API_ENDPOINTS.therapistSkills(therapistId),
      ),
  },
  schedules: {
    listFixedByDay: (day: DayOfWeek) =>
      httpClient.get<ApiFixedSchedule[]>(
        API_ENDPOINTS.schedules.fixedByDay(day),
      ),
    createFixed: (data: CreateFixedSchedulePayload) =>
      httpClient.post<ApiFixedSchedule>(API_ENDPOINTS.schedules.fixed, data),
    updateFixed: (id: string, data: UpdateFixedSchedulePayload) =>
      httpClient.patch<ApiFixedSchedule>(
        API_ENDPOINTS.schedules.fixedById(id),
        data,
      ),
    removeFixed: (id: string) =>
      httpClient.delete<ApiFixedSchedule>(
        API_ENDPOINTS.schedules.fixedById(id),
      ),
    generateDaily: (date: string) =>
      httpClient.post<ApiDailySchedule>(
        API_ENDPOINTS.schedules.dailyGenerate,
        { date },
      ),
    getDaily: (date: string) =>
      httpClient.get<ApiDailySchedule>(
        `${API_ENDPOINTS.schedules.daily}?date=${date}`,
      ),
    getFreeSlots: (date: string) =>
      httpClient.get<ApiFreeSlot[]>(
        `${API_ENDPOINTS.schedules.freeSlots}?date=${date}`,
      ),
  },
  absences: {
    list: (date: string) =>
      httpClient.get<ApiAbsenceRecord[]>(
        `${API_ENDPOINTS.absences}?date=${date}`,
      ),
    create: (data: CreateAbsencePayload) =>
      httpClient.post<{ absence: ApiAbsenceRecord }>(
        API_ENDPOINTS.absences,
        data,
      ),
  },
  cancellations: {
    list: (date: string) =>
      httpClient.get<ApiCancellation[]>(
        `${API_ENDPOINTS.cancellations}?date=${date}`,
      ),
    create: (data: CreateCancellationPayload) =>
      httpClient.post(API_ENDPOINTS.cancellations, data),
  },
  clinics: {
    getMe: () =>
      httpClient.get<{
        id: string;
        tenantId: string;
        legalName: string;
        tradeName: string;
        cnpj: string;
        email: string;
        phone: string;
      }>(API_ENDPOINTS.clinics.me),
    updateMe: (data: {
      legalName?: string;
      tradeName?: string;
      email?: string;
      phone?: string;
    }) => httpClient.patch(API_ENDPOINTS.clinics.me, data),
  },
  rescheduling: {
    generate: (date: string) =>
      httpClient.post<ApiSimulateResponse>(
        API_ENDPOINTS.rescheduling.generate,
        { date },
      ),
    simulate: (date: string) =>
      httpClient.post<ApiSimulateResponse>(
        API_ENDPOINTS.rescheduling.simulate,
        { date },
      ),
    listSuggestions: (date: string, status?: SuggestionStatus) => {
      const params = new URLSearchParams({ date });
      if (status) params.set("status", status);
      return httpClient.get<ApiRescheduleSuggestion[]>(
        `${API_ENDPOINTS.rescheduling.suggestions}?${params.toString()}`,
      );
    },
    accept: (id: string) =>
      httpClient.patch<ApiRescheduleSuggestion>(
        API_ENDPOINTS.rescheduling.accept(id),
        {},
      ),
    approve: (id: string) =>
      httpClient.post<ApiRescheduleSuggestion>(
        API_ENDPOINTS.rescheduling.approve(id),
        {},
      ),
    reject: (id: string) =>
      httpClient.post<ApiRescheduleSuggestion>(
        API_ENDPOINTS.rescheduling.reject(id),
        {},
      ),
    apply: (id: string) =>
      httpClient.post(API_ENDPOINTS.rescheduling.apply(id), {}),
  },
};
