export const SESSION_IDLE_TIMEOUT_MS = 10 * 60 * 1000;

export const IDLE_LOGOUT_MESSAGE =
  "Sua sessão expirou por inatividade. Faça login novamente.";

export const RATE_LIMIT_LOGIN_MESSAGE =
  "Muitas tentativas de acesso. Aguarde 5 minutos e tente novamente.";

export const PUBLIC_AUTH_PATHS = [
  "/login",
  "/selecionar-clinica",
  "/admin/login",
] as const;

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
