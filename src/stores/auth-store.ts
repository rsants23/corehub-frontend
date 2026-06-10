import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/modules/auth/auth.service";
import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth-cookie";
import type {
  AuthUser,
  LoginSelectionResponse,
  LoginSuccessResponse,
} from "@/types/auth";
import { isLoginSelectionResponse } from "@/types/auth";

export type LoginResult = "authenticated" | "selection_required";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  pendingClinicSelection: LoginSelectionResponse | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  selectClinic: (clinicId: string) => Promise<void>;
  clearPendingSelection: () => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  restoreSession: () => Promise<void>;
  setHydrated: () => void;
}

async function finalizeAuth(
  response: LoginSuccessResponse,
  set: (state: Partial<AuthState>) => void,
) {
  set({
    token: response.accessToken,
    user: response.user,
    isAuthenticated: true,
    pendingClinicSelection: null,
  });

  const me = await authService.getMe(response.accessToken);
  set({ user: me, isAuthenticated: true });
  setAuthSessionCookie();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      pendingClinicSelection: null,

      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({
            identifier: identifier.trim(),
            password,
          });

          if (isLoginSelectionResponse(response)) {
            set({
              pendingClinicSelection: response,
              isAuthenticated: false,
              token: null,
              user: null,
            });
            return "selection_required";
          }

          await finalizeAuth(response, set);
          return "authenticated";
        } finally {
          set({ isLoading: false });
        }
      },

      selectClinic: async (clinicId: string) => {
        const pending = get().pendingClinicSelection;
        if (!pending) {
          throw new Error("Nenhuma seleção de clínica pendente.");
        }

        set({ isLoading: true });
        try {
          const response = await authService.selectClinic({
            selectionToken: pending.selectionToken,
            clinicId,
          });
          await finalizeAuth(response, set);
        } finally {
          set({ isLoading: false });
        }
      },

      clearPendingSelection: () => set({ pendingClinicSelection: null }),

      logout: () => {
        clearAuthSessionCookie();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          pendingClinicSelection: null,
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
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            pendingClinicSelection: null,
          });
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
        pendingClinicSelection: state.pendingClinicSelection,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
