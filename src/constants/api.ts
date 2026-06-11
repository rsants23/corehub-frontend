export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    selectClinic: "/auth/select-clinic",
    memberships: "/auth/memberships",
    switchClinic: "/auth/switch-clinic",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  clinics: {
    me: "/clinics/me",
  },
  users: "/users",
  patients: "/patients",
  therapists: "/therapists",
  therapyTypes: "/therapy-types",
  therapyTypeSkills: "/therapy-types/skills",
  therapistSkills: (therapistId: string) =>
    `/therapy-types/skills/therapist/${therapistId}`,
  appointments: {
    list: "/appointments",
    day: (date: string) => `/appointments/day?date=${date}`,
    byId: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
  },
  schedules: {
    fixed: "/schedules/fixed",
    fixedById: (id: string) => `/schedules/fixed/${id}`,
    fixedByDay: (day: string) => `/schedules/fixed/day/${day}`,
    daily: "/schedules/daily",
    dailyGenerate: "/schedules/daily/generate",
    freeSlots: "/schedules/daily/free-slots",
  },
  absences: "/absences",
  cancellations: "/cancellations",
  rescheduling: {
    generate: "/rescheduling/generate",
    simulate: "/rescheduling/simulate",
    suggestions: "/rescheduling/suggestions",
    opportunities: "/rescheduling/opportunities",
    accept: (id: string) => `/rescheduling/suggestions/${id}/accept`,
    approve: (id: string) => `/rescheduling/suggestions/${id}/approve`,
    reject: (id: string) => `/rescheduling/suggestions/${id}/reject`,
    apply: (id: string) => `/rescheduling/suggestions/${id}/apply`,
  },
  reports: {
    dashboard: "/reports/dashboard",
    occupancy: "/reports/occupancy",
    absences: "/reports/absences",
    rescheduling: "/reports/rescheduling",
  },
  auditLogs: "/audit-logs",
  consents: "/consents",
  therapistPortal: {
    me: "/therapist/me",
    agenda: (date: string) => `/therapist/me/agenda?date=${date}`,
    patients: "/therapist/me/patients",
    patientById: (id: string) => `/therapist/me/patients/${id}`,
    appointmentStatus: (id: string) => `/therapist/me/appointments/${id}/status`,
  },
  patientPortal: {
    me: "/patient-portal/me",
    agenda: (patientId: string, dateFrom?: string, dateTo?: string) => {
      const params = new URLSearchParams({ patientId });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      return `/patient-portal/agenda?${params.toString()}`;
    },
    patientById: (id: string) => `/patient-portal/patients/${id}`,
    consents: (patientId?: string) =>
      patientId
        ? `/patient-portal/consents?patientId=${patientId}`
        : "/patient-portal/consents",
    cancelAppointment: (id: string) =>
      `/patient-portal/appointments/${id}/cancel`,
  },
  admin: {
    login: "/admin/auth/login",
    me: "/admin/auth/me",
    logout: "/admin/auth/logout",
    dashboardStats: "/admin/dashboard/stats",
    plans: "/admin/plans",
    planById: (id: string) => `/admin/plans/${id}`,
    clinics: "/admin/clinics",
    clinicById: (id: string) => `/admin/clinics/${id}`,
    clinicStatus: (id: string) => `/admin/clinics/${id}/status`,
    clinicSubscription: (id: string) => `/admin/clinics/${id}/subscription`,
    clinicSubscriptionRenew: (id: string) =>
      `/admin/clinics/${id}/subscription/renew`,
    clinicInvoices: (id: string) => `/admin/clinics/${id}/invoices`,
    clinicUsers: (id: string) => `/admin/clinics/${id}/users`,
    clinicUserById: (id: string, userId: string) =>
      `/admin/clinics/${id}/users/${userId}`,
    clinicUserPassword: (id: string, userId: string) =>
      `/admin/clinics/${id}/users/${userId}/password`,
    clinicUserStatus: (id: string, userId: string) =>
      `/admin/clinics/${id}/users/${userId}/status`,
    invoiceById: (id: string) => `/admin/invoices/${id}`,
    invoiceMarkPaid: (id: string) => `/admin/invoices/${id}/mark-paid`,
    invoiceCancel: (id: string) => `/admin/invoices/${id}/cancel`,
    sharedUsers: "/admin/shared-users",
  },
} as const;

export const QUERY_KEYS = {
  auth: ["auth", "me"] as const,
  authMemberships: ["auth", "memberships"] as const,
  patients: ["patients"] as const,
  patient: (id: string) => ["patients", id] as const,
  therapists: ["therapists"] as const,
  users: ["users"] as const,
  therapyTypes: ["therapy-types"] as const,
  therapistSkills: (therapistId: string) =>
    ["therapist-skills", therapistId] as const,
  fixedSchedules: ["fixed-schedules"] as const,
  dailySchedule: (date: string) => ["daily-schedule", date] as const,
  appointments: (date: string) => ["appointments", date] as const,
  freeSlots: (date: string) => ["free-slots", date] as const,
  absences: (date: string) => ["absences", date] as const,
  cancellations: (date: string) => ["cancellations", date] as const,
  suggestions: (date: string) => ["suggestions", date] as const,
  opportunities: (date: string) => ["opportunities", date] as const,
  dashboard: (date: string) => ["dashboard", date] as const,
  reports: (date: string) => ["reports", date] as const,
  auditLogs: ["audit-logs"] as const,
  consents: (patientId?: string) =>
    patientId ? (["consents", patientId] as const) : (["consents"] as const),
  adminDashboard: ["admin", "dashboard"] as const,
  adminClinics: ["admin", "clinics"] as const,
  adminClinic: (id: string) => ["admin", "clinic", id] as const,
  adminPlans: ["admin", "plans"] as const,
  adminClinicUsers: (id: string) => ["admin", "clinic-users", id] as const,
  adminClinicInvoices: (id: string) => ["admin", "clinic-invoices", id] as const,
  adminMe: ["admin", "me"] as const,
  adminSharedUsers: ["admin", "shared-users"] as const,
  therapistPortalMe: ["therapist-portal", "me"] as const,
  therapistAgenda: (date: string) => ["therapist-portal", "agenda", date] as const,
  therapistPatients: ["therapist-portal", "patients"] as const,
  therapistPatient: (id: string) => ["therapist-portal", "patient", id] as const,
  patientPortalMe: ["patient-portal", "me"] as const,
  patientPortalAgenda: (patientId: string, from?: string, to?: string) =>
    ["patient-portal", "agenda", patientId, from, to] as const,
  patientPortalConsents: (patientId?: string) =>
    patientId
      ? (["patient-portal", "consents", patientId] as const)
      : (["patient-portal", "consents"] as const),
};
