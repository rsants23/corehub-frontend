import type { UserRole } from "@/types/auth";

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  patients: "/pacientes",
  therapists: "/terapeutas",
  schedules: "/agendas",
  absences: "/faltas",
  rescheduling: "/remanejamento",
  reports: "/relatorios",
  users: "/usuarios",
  settings: "/configuracoes",
  audit: "/auditoria",
  forbidden: "/acesso-negado",
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordenação",
  RECEPTION: "Recepção",
  THERAPIST: "Terapeuta",
};

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: "LayoutDashboard",
    roles: ["ADMIN", "COORDINATOR", "RECEPTION", "THERAPIST"] as UserRole[],
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
    roles: ["ADMIN", "COORDINATOR", "RECEPTION", "THERAPIST"] as UserRole[],
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
    label: "Usuários",
    href: ROUTES.users,
    icon: "UserCog",
    roles: ["ADMIN"] as UserRole[],
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

export function getNavItemsForRole(role: UserRole | undefined) {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccessRoute(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  if (path === ROUTES.forbidden || path === ROUTES.login) return true;

  const item = NAV_ITEMS.find(
    (nav) => path === nav.href || path.startsWith(`${nav.href}/`),
  );

  if (!item) return role === "ADMIN";
  return item.roles.includes(role);
}
