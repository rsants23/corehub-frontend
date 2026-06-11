"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS, ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/services/api-error";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

export function ClinicSwitcher() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeClinic = useAuthStore((s) => s.activeClinic);
  const memberships = useAuthStore((s) => s.memberships);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadMemberships = useAuthStore((s) => s.loadMemberships);
  const switchClinic = useAuthStore((s) => s.switchClinic);
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (isAuthenticated && memberships.length === 0) {
      void loadMemberships();
    }
  }, [isAuthenticated, memberships.length, loadMemberships]);

  if (!isAuthenticated || memberships.length <= 1) {
    return null;
  }

  const handleChange = async (clinicId: string) => {
    if (clinicId === activeClinic?.clinicId) return;

    const target = memberships.find((m) => m.clinicId === clinicId);
    if (target && !target.available) {
      showToast(
        target.blockReason ?? "Esta clínica está indisponível no momento.",
        "error",
      );
      return;
    }

    try {
      await switchClinic(clinicId);
      await queryClient.invalidateQueries();
      showToast("Clínica alterada com sucesso", "success");
      router.push(ROUTES.dashboard);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao trocar de clínica"), "error");
    }
  };

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="text-xs font-medium text-muted-foreground">
        Clínica Atual
      </span>
      <Select
        value={activeClinic?.clinicId ?? ""}
        onValueChange={(value) => void handleChange(value)}
        disabled={isLoading}
      >
        <SelectTrigger
          className="h-9 w-[180px] border-dashed md:w-[220px]"
          aria-label="Clínica atual"
        >
          <SelectValue placeholder="Clínica Atual" />
        </SelectTrigger>
        <SelectContent>
          {memberships.map((membership) => (
            <SelectItem
              key={membership.clinicId}
              value={membership.clinicId}
              disabled={!membership.available}
            >
              <span className="flex flex-col">
                <span>{membership.clinicName}</span>
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABELS[membership.role]}
                  {!membership.available ? " · Indisponível" : ""}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
