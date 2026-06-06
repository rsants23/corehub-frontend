import type { Absence } from "@/types";

export const absencesMock: Absence[] = [
  {
    id: "1",
    type: "patient",
    date: "2025-06-06",
    name: "Miguel Santos",
    reason: "Doença",
    notes: "Responsável informou febre na noite anterior.",
  },
  {
    id: "2",
    type: "therapist",
    date: "2025-06-06",
    name: "Dr. Bruno Carvalho",
    reason: "Consulta médica",
    notes: "Retorno previsto no período da tarde.",
  },
  {
    id: "3",
    type: "patient",
    date: "2025-06-05",
    name: "Isabela Rocha",
    reason: "Viagem familiar",
  },
  {
    id: "4",
    type: "therapist",
    date: "2025-06-04",
    name: "Dra. Patrícia Moura",
    reason: "Licença",
    notes: "Ausência programada.",
  },
];
