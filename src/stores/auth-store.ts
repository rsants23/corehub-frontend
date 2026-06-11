import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/modules/auth/auth.service";
import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "@/lib/auth-cookie";
import type {
  ActiveClinic,
  AuthUser,
  LoginSelectionResponse,
  LoginSuccessResponse,
  MembershipSummary,
  MeResponse,
} from "@/types/auth";
import { isLoginSelectionResponse } from "@/types/auth";

export type LoginResult = "authenticated" | "selection_required";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  pendingClinicSelection: LoginSelectionResponse | null;
  memberships: MembershipSummary[];
  activeClinic: ActiveClinic | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  selectClinic: (clinicId: string) => Promise<void>;
  switchClinic: (clinicId: string) => Promise<void>;
  loadMemberships: () => Promise<void>;
  clearPendingSelection: () => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  restoreSession: () => Promise<void>;
  setHydrated: () => void;
}

function deriveActiveClinic(
  user: MeResponse | AuthUser,
  memberships: MembershipSummary[],
): ActiveClinic {
  const match = memberships.find((m) => m.clinicId === user.clinicId);
  if (match) {
    return {
      clinicId: match.clinicId,
      clinicName: match.clinicName,
      role: match.role,
      tenantId: match.tenantId,
    };
  }

  return {
    clinicId: user.clinicId,
    clinicName: user.clinic?.tradeName ?? "Clínica",
    role: user.role,
    tenantId: user.tenantId,
  };
}

async function syncSessionContext(set: (state: Partial<AuthState>) => void) {
  const me = await authService.getMe();
  let memberships: MembershipSummary[] = [];

  try {
    memberships = await authService.getMemberships();
  } catch {
    memberships = [];
  }

  set({
    user: me,
    isAuthenticated: true,
    memberships,
    activeClinic: deriveActiveClinic(me, memberships),
  });
  setAuthSessionCookie();
}

async function finalizeAuth(
  response: LoginSuccessResponse,
  set: (state: Partial<AuthState>) => void,
) {
  set({
    user: response.user,
    isAuthenticated: true,
    pendingClinicSelection: null,
  });

  await syncSessionContext(set);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isLoading: false,
      pendingClinicSelection: null,
      memberships: [],
      activeClinic: null,

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
              user: null,
              memberships: [],
              activeClinic: null,
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

      switchClinic: async (clinicId: string) => {
        const { activeClinic } = get();
        if (activeClinic?.clinicId === clinicId) {
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authService.switchClinic({ clinicId });
          await finalizeAuth(response, set);
        } finally {
          set({ isLoading: false });
        }
      },

      loadMemberships: async () => {
        if (!get().isAuthenticated) return;

        const memberships = await authService.getMemberships();
        const user = get().user;
        set({
          memberships,
          activeClinic: user
            ? deriveActiveClinic(user, memberships)
            : get().activeClinic,
        });
      },

      clearPendingSelection: () => set({ pendingClinicSelection: null }),

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Limpa sessão local mesmo se a API falhar
        }
        clearAuthSessionCookie();
        set({
          user: null,
          isAuthenticated: false,
          pendingClinicSelection: null,
          memberships: [],
          activeClinic: null,
        });
      },

      updateUser: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state,
        ),

      restoreSession: async () => {
        set({ isLoading: true });
        try {
          await syncSessionContext(set);
        } catch {
          clearAuthSessionCookie();
          set({
            user: null,
            isAuthenticated: false,
            pendingClinicSelection: null,
            memberships: [],
            activeClinic: null,
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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingClinicSelection: state.pendingClinicSelection,
        memberships: state.memberships,
        activeClinic: state.activeClinic,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
