import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS, QUERY_KEYS } from "@/constants/api";
import { httpClient } from "@/services/http-client";
import type {
  PatientPortalAgendaItem,
  PatientPortalConsent,
  PatientPortalMe,
  TherapistAgendaItem,
  TherapistAppointmentAction,
  TherapistPatientDetail,
  TherapistPatientSummary,
  TherapistPortalMe,
} from "@/types/portal";

export const therapistPortalApi = {
  getMe: () =>
    httpClient.get<TherapistPortalMe>(API_ENDPOINTS.therapistPortal.me),
  getAgenda: (date: string) =>
    httpClient.get<TherapistAgendaItem[]>(
      API_ENDPOINTS.therapistPortal.agenda(date),
    ),
  getPatients: () =>
    httpClient.get<TherapistPatientSummary[]>(
      API_ENDPOINTS.therapistPortal.patients,
    ),
  getPatient: (id: string) =>
    httpClient.get<TherapistPatientDetail>(
      API_ENDPOINTS.therapistPortal.patientById(id),
    ),
  updateAppointmentStatus: (id: string, status: TherapistAppointmentAction) =>
    httpClient.patch<{ id: string; status: string; origin: string }>(
      API_ENDPOINTS.therapistPortal.appointmentStatus(id),
      { status },
    ),
};

export const patientPortalApi = {
  getMe: () =>
    httpClient.get<PatientPortalMe>(API_ENDPOINTS.patientPortal.me),
  getAgenda: (patientId: string, dateFrom?: string, dateTo?: string) =>
    httpClient.get<PatientPortalAgendaItem[]>(
      API_ENDPOINTS.patientPortal.agenda(patientId, dateFrom, dateTo),
    ),
  getConsents: (patientId?: string) =>
    httpClient.get<PatientPortalConsent[]>(
      API_ENDPOINTS.patientPortal.consents(patientId),
    ),
  createConsent: (data: {
    patientId: string;
    guardianName: string;
    purpose: string;
    version: string;
  }) =>
    httpClient.post<PatientPortalConsent>(
      API_ENDPOINTS.patientPortal.consents(),
      data,
    ),
  requestCancellation: (appointmentId: string) =>
    httpClient.patch<{ id: string; status: string }>(
      API_ENDPOINTS.patientPortal.cancelAppointment(appointmentId),
    ),
};

export function useTherapistAgendaQuery(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.therapistAgenda(date),
    queryFn: () => therapistPortalApi.getAgenda(date),
  });
}

export function useTherapistPatientsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.therapistPatients,
    queryFn: () => therapistPortalApi.getPatients(),
  });
}

export function useTherapistPatientQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.therapistPatient(id),
    queryFn: () => therapistPortalApi.getPatient(id),
    enabled: Boolean(id),
  });
}

export function useTherapistPortalMutations() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: TherapistAppointmentAction;
    }) => therapistPortalApi.updateAppointmentStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["therapist-portal"] });
    },
  });

  return { updateStatus };
}

export function usePatientPortalMeQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.patientPortalMe,
    queryFn: () => patientPortalApi.getMe(),
  });
}

export function usePatientPortalAgendaQuery(
  patientId: string | undefined,
  dateFrom?: string,
  dateTo?: string,
) {
  return useQuery({
    queryKey: QUERY_KEYS.patientPortalAgenda(patientId ?? "", dateFrom, dateTo),
    queryFn: () =>
      patientPortalApi.getAgenda(patientId!, dateFrom, dateTo),
    enabled: Boolean(patientId),
  });
}

export function usePatientPortalConsentsQuery(patientId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patientPortalConsents(patientId),
    queryFn: () => patientPortalApi.getConsents(patientId),
  });
}

export function usePatientPortalMutations() {
  const queryClient = useQueryClient();

  const createConsent = useMutation({
    mutationFn: patientPortalApi.createConsent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patient-portal"] });
    },
  });

  const requestCancellation = useMutation({
    mutationFn: patientPortalApi.requestCancellation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patient-portal"] });
    },
  });

  return { createConsent, requestCancellation };
}
