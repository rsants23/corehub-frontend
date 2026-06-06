export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  patients: "/pacientes",
  therapists: "/terapeutas",
  schedules: "/agendas",
  absences: "/faltas",
  rescheduling: "/remanejamento",
  reports: "/relatorios",
  settings: "/configuracoes",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Pacientes", href: ROUTES.patients, icon: "Users" },
  { label: "Terapeutas", href: ROUTES.therapists, icon: "Stethoscope" },
  { label: "Agendas", href: ROUTES.schedules, icon: "Calendar" },
  { label: "Faltas", href: ROUTES.absences, icon: "UserX" },
  { label: "Remanejamento", href: ROUTES.rescheduling, icon: "Shuffle" },
  { label: "Relatórios", href: ROUTES.reports, icon: "BarChart3" },
  { label: "Configurações", href: ROUTES.settings, icon: "Settings" },
] as const;
