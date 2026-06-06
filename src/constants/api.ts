export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3100/api";

export const API_ENDPOINTS = {
  patients: "/patients",
  therapists: "/therapists",
  therapyTypes: "/therapy-types",
  schedules: {
    fixed: "/schedules/fixed",
    daily: "/schedules/daily",
    freeSlots: "/schedules/daily/free-slots",
  },
  absences: "/absences",
  cancellations: "/cancellations",
  rescheduling: {
    simulate: "/rescheduling/simulate",
    suggestions: "/rescheduling/suggestions",
  },
} as const;
