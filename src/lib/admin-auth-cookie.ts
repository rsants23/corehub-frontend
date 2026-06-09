export const ADMIN_AUTH_SESSION_COOKIE = "corehub-admin-session";

const SESSION_MAX_AGE_SECONDS = 4 * 60 * 60;

export function setAdminAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_AUTH_SESSION_COOKIE}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAdminAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_AUTH_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
