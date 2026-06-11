import { describe, expect, it } from "vitest";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-cookie";

describe("session constants", () => {
  it("usa cookie de sessão dedicada ao middleware", () => {
    expect(AUTH_SESSION_COOKIE).toBe("corehub-session");
  });
});
