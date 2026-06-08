export const AUTH_SESSION_COOKIE = "corehub-session";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

/** Sinaliza sessão ativa para o middleware (complementa o token no localStorage). */
export function setAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
