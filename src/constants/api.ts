export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3100/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    me: "/auth/me",
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
    accept: (id: string) => `/rescheduling/suggestions/${id}/accept`,
    approve: (id: string) => `/rescheduling/suggestions/${id}/approve`,
    reject: (id: string) => `/rescheduling/suggestions/${id}/reject`,
    apply: (id: string) => `/rescheduling/suggestions/${id}/apply`,
  },
  reports: {
    dashboard: "/reports/dashboard",
    occupancy: "/reports/occupancy",
    absences: "/reports/absences",
  },
  auditLogs: "/audit-logs",
  consents: "/consents",
  admin: {
    login: "/admin/auth/login",
    me: "/admin/auth/me",
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
    clinicUserStatus: (id: string, userId: string) =>
      `/admin/clinics/${id}/users/${userId}/status`,
    invoiceById: (id: string) => `/admin/invoices/${id}`,
    invoiceMarkPaid: (id: string) => `/admin/invoices/${id}/mark-paid`,
    invoiceCancel: (id: string) => `/admin/invoices/${id}/cancel`,
  },
} as const;

export const QUERY_KEYS = {
  auth: ["auth", "me"] as const,
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
};
