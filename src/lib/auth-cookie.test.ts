import { describe, expect, it } from "vitest";
import {
  AUTH_SESSION_COOKIE,
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth-cookie";

describe("auth-cookie", () => {
  it("define nome estável do cookie de sessão", () => {
    expect(AUTH_SESSION_COOKIE).toBe("corehub-session");
  });

  it("grava e limpa cookie de sessão no documento", () => {
    setAuthSessionCookie();
    expect(document.cookie).toContain(`${AUTH_SESSION_COOKIE}=1`);

    clearAuthSessionCookie();
    expect(document.cookie).toContain(`${AUTH_SESSION_COOKIE}=`);
  });
});
