import type { RescheduleSuggestion } from "@/types";

export const rescheduleSuggestionsMock: RescheduleSuggestion[] = [
  {
    id: "1",
    affectedPatient: "Miguel Santos",
    cancelledAppointment: "Fonoaudiologia — Qua 14:00",
    suggestedTime: "Qua 16:00",
    suggestedTherapist: "Dra. Camila Nogueira",
    confidenceLevel: 92,
    status: "PENDING",
  },
  {
    id: "2",
    affectedPatient: "Gabriel Costa",
    cancelledAppointment: "Fisioterapia — Ter 10:00",
    suggestedTime: "Ter 15:30",
    suggestedTherapist: "Dr. Bruno Carvalho",
    confidenceLevel: 78,
    status: "PENDING",
  },
  {
    id: "3",
    affectedPatient: "Sofia Almeida",
    cancelledAppointment: "Psicologia — Seg 09:00",
    suggestedTime: "Seg 11:00",
    suggestedTherapist: "Dr. Rafael Lima",
    confidenceLevel: 85,
    status: "ACCEPTED",
  },
  {
    id: "4",
    affectedPatient: "Lucas Mendes",
    cancelledAppointment: "Terapia Ocupacional — Qui 11:00",
    suggestedTime: "Sex 10:00",
    suggestedTherapist: "Dra. Juliana Freitas",
    confidenceLevel: 65,
    status: "REJECTED",
  },
];
