import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/modules/auth/auth.service";
import { normalizeCnpj } from "@/modules/auth/schemas/login.schema";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  login: (cnpj: string, email: string, password: string) => Promise<void>;
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

      login: async (cnpj: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({
            cnpj: normalizeCnpj(cnpj),
            email: email.toLowerCase(),
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
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

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
        } catch {
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
