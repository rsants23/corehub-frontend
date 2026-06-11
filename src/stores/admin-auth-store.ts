import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearAdminAuthSessionCookie,
  setAdminAuthSessionCookie,
} from "@/lib/admin-auth-cookie";
import { adminAuthService } from "@/modules/admin/services/admin-auth.service";
import type { AdminUser } from "@/types/admin-auth";

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setHydrated: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await adminAuthService.login(email, password);

          set({
            user: response.user,
            isAuthenticated: true,
          });

          const me = await adminAuthService.getMe();
          set({ user: me, isAuthenticated: true });
          setAdminAuthSessionCookie();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await adminAuthService.logout();
        } catch {
          // Limpa sessão local mesmo se a API falhar
        }
        clearAdminAuthSessionCookie();
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      restoreSession: async () => {
        set({ isLoading: true });
        try {
          const me = await adminAuthService.getMe();
          set({ user: me, isAuthenticated: true });
          setAdminAuthSessionCookie();
        } catch {
          clearAdminAuthSessionCookie();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "corehub-admin-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
