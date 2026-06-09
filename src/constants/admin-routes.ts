export const ADMIN_ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard",
  clinics: "/admin/clinicas",
  clinicDetail: (id: string) => `/admin/clinicas/${id}`,
  plans: "/admin/planos",
} as const;

export const ADMIN_NAV_ITEMS = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard" },
  { href: ADMIN_ROUTES.clinics, label: "Clínicas" },
  { href: ADMIN_ROUTES.plans, label: "Planos" },
] as const;
