import type { UserRole } from "@/types/auth";

export const ROUTES = {
  login: "/login",
  selectClinic: "/selecionar-clinica",
  dashboard: "/dashboard",
  patients: "/pacientes",
  therapists: "/terapeutas",
  schedules: "/agendas",
  dailyAgenda: "/agenda-diaria",
  absences: "/faltas",
  rescheduling: "/remanejamento",
  reports: "/relatorios",
  users: "/usuarios",
  settings: "/configuracoes",
  audit: "/auditoria",
  consents: "/consentimentos",
  forbidden: "/acesso-negado",
  myAgenda: "/minha-agenda",
  myPatients: "/meus-pacientes",
  portal: "/portal",
  portalAgenda: "/portal/agenda",
  portalConsents: "/portal/consentimentos",
  portalProfile: "/portal/perfil",
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordenação",
  RECEPTION: "Recepção",
  THERAPIST: "Terapeuta",
  PATIENT: "Paciente",
  GUARDIAN: "Responsável",
};

const CLINIC_ADMIN_ROLES: UserRole[] = ["ADMIN", "COORDINATOR", "RECEPTION"];
const PORTAL_ROLES: UserRole[] = ["PATIENT", "GUARDIAN"];

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: "LayoutDashboard",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Pacientes",
    href: ROUTES.patients,
    icon: "Users",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Terapeutas",
    href: ROUTES.therapists,
    icon: "Stethoscope",
    roles: ["ADMIN", "COORDINATOR"] as UserRole[],
  },
  {
    label: "Agendas",
    href: ROUTES.schedules,
    icon: "Calendar",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Agenda diária",
    href: ROUTES.dailyAgenda,
    icon: "CalendarDays",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Faltas",
    href: ROUTES.absences,
    icon: "UserX",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Remanejamento",
    href: ROUTES.rescheduling,
    icon: "Shuffle",
    roles: ["ADMIN", "COORDINATOR"] as UserRole[],
  },
  {
    label: "Relatórios",
    href: ROUTES.reports,
    icon: "BarChart3",
    roles: ["ADMIN", "COORDINATOR"] as UserRole[],
  },
  {
    label: "Consentimentos",
    href: ROUTES.consents,
    icon: "ShieldCheck",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION"] as UserRole[],
  },
  {
    label: "Usuários",
    href: ROUTES.users,
    icon: "UserCog",
    roles: ["ADMIN", "COORDINATOR"] as UserRole[],
  },
  {
    label: "Configurações",
    href: ROUTES.settings,
    icon: "Settings",
    roles: ["ADMIN"] as UserRole[],
  },
  {
    label: "Auditoria",
    href: ROUTES.audit,
    icon: "ScrollText",
    roles: ["ADMIN", "COORDINATOR"] as UserRole[],
  },
] as const;

export const THERAPIST_NAV_ITEMS = [
  {
    label: "Minha Agenda",
    href: ROUTES.myAgenda,
    icon: "CalendarDays",
    roles: ["THERAPIST"] as UserRole[],
  },
  {
    label: "Meus Pacientes",
    href: ROUTES.myPatients,
    icon: "Users",
    roles: ["THERAPIST"] as UserRole[],
  },
] as const;

export const PORTAL_NAV_ITEMS = [
  {
    label: "Minha Agenda",
    href: ROUTES.portalAgenda,
    icon: "CalendarDays",
    roles: PORTAL_ROLES,
  },
  {
    label: "Consentimentos",
    href: ROUTES.portalConsents,
    icon: "ShieldCheck",
    roles: PORTAL_ROLES,
  },
  {
    label: "Perfil",
    href: ROUTES.portalProfile,
    icon: "UserCircle",
    roles: PORTAL_ROLES,
  },
] as const;

const THERAPIST_ROUTE_PREFIXES = [ROUTES.myAgenda, ROUTES.myPatients];
const PORTAL_ROUTE_PREFIXES = [
  ROUTES.portal,
  ROUTES.portalAgenda,
  ROUTES.portalConsents,
  ROUTES.portalProfile,
];
const CLINIC_ADMIN_ROUTE_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.patients,
  ROUTES.therapists,
  ROUTES.schedules,
  ROUTES.dailyAgenda,
  ROUTES.absences,
  ROUTES.rescheduling,
  ROUTES.reports,
  ROUTES.users,
  ROUTES.settings,
  ROUTES.audit,
  ROUTES.consents,
];

function matchesPrefix(path: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function getHomeRouteForRole(role: UserRole | undefined): string {
  if (!role) return ROUTES.login;
  if (role === "THERAPIST") return ROUTES.myAgenda;
  if (role === "PATIENT" || role === "GUARDIAN") return ROUTES.portalAgenda;
  return ROUTES.dashboard;
}

export function getNavItemsForRole(role: UserRole | undefined) {
  if (!role) return [];
  if (role === "THERAPIST") return [...THERAPIST_NAV_ITEMS];
  if (role === "PATIENT" || role === "GUARDIAN") return [...PORTAL_NAV_ITEMS];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccessRoute(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  if (path === ROUTES.forbidden || path === ROUTES.login) return true;

  if (role === "THERAPIST") {
    return matchesPrefix(path, THERAPIST_ROUTE_PREFIXES);
  }

  if (PORTAL_ROLES.includes(role)) {
    return matchesPrefix(path, PORTAL_ROUTE_PREFIXES);
  }

  if (CLINIC_ADMIN_ROLES.includes(role)) {
    if (
      matchesPrefix(path, THERAPIST_ROUTE_PREFIXES) ||
      matchesPrefix(path, PORTAL_ROUTE_PREFIXES)
    ) {
      return false;
    }

    const item = NAV_ITEMS.find(
      (nav) => path === nav.href || path.startsWith(`${nav.href}/`),
    );

    if (!item) return role === "ADMIN";
    return item.roles.includes(role);
  }

  return false;
}

export function isClinicAdminRoute(path: string): boolean {
  return matchesPrefix(path, CLINIC_ADMIN_ROUTE_PREFIXES);
}
