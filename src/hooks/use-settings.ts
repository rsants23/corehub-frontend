"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/api";
import { settingsService } from "@/modules/configuracoes/services/settings.service";
import type {
  CreateTherapyTypePayload,
  LinkTherapistSkillPayload,
} from "@/types/api";

export function useSettings() {
  const therapyTypes = useQuery({
    queryKey: QUERY_KEYS.therapyTypes,
    queryFn: () => settingsService.listTherapyTypes(),
  });

  const counts = useQuery({
    queryKey: ["settings-counts"],
    queryFn: () => settingsService.getCounts(),
  });

  const clinic = useQuery({
    queryKey: ["clinic", "me"],
    queryFn: () => settingsService.getClinic(),
  });

  return { therapyTypes, counts, clinic };
}

export function useTherapistSkills(therapistId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.therapistSkills(therapistId ?? ""),
    queryFn: () => settingsService.listTherapistSkills(therapistId!),
    enabled: Boolean(therapistId),
  });
}

export function useSettingsMutations() {
  const queryClient = useQueryClient();

  const createTherapyType = useMutation({
    mutationFn: (payload: CreateTherapyTypePayload) =>
      settingsService.createTherapyType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.therapyTypes });
      queryClient.invalidateQueries({ queryKey: ["settings-counts"] });
    },
  });

  const linkTherapistSkill = useMutation({
    mutationFn: (payload: LinkTherapistSkillPayload) =>
      settingsService.linkTherapistSkill(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.therapistSkills(variables.therapistId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.therapists });
    },
  });

  const updateClinic = useMutation({
    mutationFn: settingsService.updateClinic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic", "me"] });
    },
  });

  return { createTherapyType, linkTherapistSkill, updateClinic };
}
