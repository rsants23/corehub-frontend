export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3100/api";

export const API_ENDPOINTS = {
  patients: "/patients",
  therapists: "/therapists",
  therapyTypes: "/therapy-types",
  therapyTypeSkills: "/therapy-types/skills",
  therapistSkills: (therapistId: string) =>
    `/therapy-types/skills/therapist/${therapistId}`,
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
    simulate: "/rescheduling/simulate",
    suggestions: "/rescheduling/suggestions",
    accept: (id: string) => `/rescheduling/suggestions/${id}/accept`,
    reject: (id: string) => `/rescheduling/suggestions/${id}/reject`,
    apply: (id: string) => `/rescheduling/suggestions/${id}/apply`,
  },
} as const;

export const QUERY_KEYS = {
  patients: ["patients"] as const,
  patient: (id: string) => ["patients", id] as const,
  therapists: ["therapists"] as const,
  therapyTypes: ["therapy-types"] as const,
  therapistSkills: (therapistId: string) =>
    ["therapist-skills", therapistId] as const,
  fixedSchedules: ["fixed-schedules"] as const,
  dailySchedule: (date: string) => ["daily-schedule", date] as const,
  freeSlots: (date: string) => ["free-slots", date] as const,
  absences: (date: string) => ["absences", date] as const,
  cancellations: (date: string) => ["cancellations", date] as const,
  suggestions: (date: string) => ["suggestions", date] as const,
  dashboard: (date: string) => ["dashboard", date] as const,
  reports: (date: string) => ["reports", date] as const,
};
