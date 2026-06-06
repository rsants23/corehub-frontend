"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsService } from "@/modules/pacientes/services/patients.service";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => patientsService.list(),
  });
}
