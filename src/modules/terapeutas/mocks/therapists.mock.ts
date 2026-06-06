import type { Therapist } from "@/types";

export const therapistsMock: Therapist[] = [
  {
    id: "1",
    name: "Dra. Camila Nogueira",
    specialty: "Fonoaudiologia",
    weeklyHours: 30,
    status: "active",
    email: "camila@efatacorehub.com",
  },
  {
    id: "2",
    name: "Dr. Rafael Lima",
    specialty: "Psicologia",
    weeklyHours: 25,
    status: "active",
    email: "rafael@efatacorehub.com",
  },
  {
    id: "3",
    name: "Dra. Juliana Freitas",
    specialty: "Terapia Ocupacional",
    weeklyHours: 28,
    status: "active",
    email: "juliana@efatacorehub.com",
  },
  {
    id: "4",
    name: "Dr. Bruno Carvalho",
    specialty: "Fisioterapia",
    weeklyHours: 20,
    status: "active",
    email: "bruno@efatacorehub.com",
  },
  {
    id: "5",
    name: "Dra. Patrícia Moura",
    specialty: "Psicologia",
    weeklyHours: 15,
    status: "inactive",
    email: "patricia@efatacorehub.com",
  },
];
