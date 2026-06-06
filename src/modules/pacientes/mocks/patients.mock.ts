import type { Patient } from "@/types";

export const patientsMock: Patient[] = [
  {
    id: "1",
    name: "Lucas Mendes",
    guardianName: "Ana Mendes",
    insurance: "Unimed",
    therapies: ["Fonoaudiologia", "Terapia Ocupacional"],
    status: "active",
  },
  {
    id: "2",
    name: "Sofia Almeida",
    guardianName: "Carlos Almeida",
    insurance: "Bradesco Saúde",
    therapies: ["Psicologia"],
    status: "active",
  },
  {
    id: "3",
    name: "Gabriel Costa",
    guardianName: "Mariana Costa",
    insurance: "Particular",
    therapies: ["Fisioterapia", "Psicologia"],
    status: "active",
  },
  {
    id: "4",
    name: "Isabela Rocha",
    guardianName: "Paulo Rocha",
    insurance: "Amil",
    therapies: ["Terapia Ocupacional"],
    status: "inactive",
  },
  {
    id: "5",
    name: "Miguel Santos",
    guardianName: "Fernanda Santos",
    insurance: "Unimed",
    therapies: ["Fonoaudiologia"],
    status: "active",
  },
];
