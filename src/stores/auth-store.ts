import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/modules/auth/auth.service";
import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth-cookie";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  restoreSession: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,

      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({
            identifier: identifier.trim(),
            password,
          });

          set({
            token: response.accessToken,
            user: response.user,
            isAuthenticated: true,
          });

          const me = await authService.getMe(response.accessToken);
          set({
            user: me,
            isAuthenticated: true,
          });
          setAuthSessionCookie();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        clearAuthSessionCookie();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state,
        ),

      restoreSession: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const me = await authService.getMe();
          set({ user: me, isAuthenticated: true });
          setAuthSessionCookie();
        } catch {
          clearAuthSessionCookie();
          set({ user: null, token: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "corehub-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
