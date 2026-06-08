import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ClinicData {
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
}

export interface Convenio {
  id: string;
  name: string;
  active: boolean;
}

export interface AccessProfile {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
}

const DEFAULT_CLINIC: ClinicData = {
  name: "Clínica Efata",
  cnpj: "",
  phone: "",
  email: "contato@clinicaefata.com.br",
  address: "",
};

const DEFAULT_PROFILES: AccessProfile[] = [
  {
    id: "coordenacao",
    name: "Coordenação",
    permissions: {
      pacientes: true,
      terapeutas: true,
      agendas: true,
      faltas: true,
      remanejamento: true,
      relatorios: true,
      configuracoes: true,
    },
  },
  {
    id: "recepcao",
    name: "Recepção",
    permissions: {
      pacientes: true,
      terapeutas: false,
      agendas: true,
      faltas: true,
      remanejamento: false,
      relatorios: false,
      configuracoes: false,
    },
  },
  {
    id: "terapeuta",
    name: "Terapeuta",
    permissions: {
      pacientes: true,
      terapeutas: false,
      agendas: true,
      faltas: true,
      remanejamento: false,
      relatorios: false,
      configuracoes: false,
    },
  },
];

interface ClinicSettingsState {
  clinic: ClinicData;
  convenios: Convenio[];
  profiles: AccessProfile[];
  updateClinic: (data: Partial<ClinicData>) => void;
  addConvenio: (name: string) => void;
  toggleConvenio: (id: string) => void;
  removeConvenio: (id: string) => void;
  toggleProfilePermission: (
    profileId: string,
    permission: string,
  ) => void;
}

export const useClinicSettingsStore = create<ClinicSettingsState>()(
  persist(
    (set) => ({
      clinic: DEFAULT_CLINIC,
      convenios: [
        { id: "1", name: "Particular", active: true },
        { id: "2", name: "Unimed", active: true },
      ],
      profiles: DEFAULT_PROFILES,
      updateClinic: (data) =>
        set((state) => ({ clinic: { ...state.clinic, ...data } })),
      addConvenio: (name) =>
        set((state) => ({
          convenios: [
            ...state.convenios,
            { id: crypto.randomUUID(), name, active: true },
          ],
        })),
      toggleConvenio: (id) =>
        set((state) => ({
          convenios: state.convenios.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c,
          ),
        })),
      removeConvenio: (id) =>
        set((state) => ({
          convenios: state.convenios.filter((c) => c.id !== id),
        })),
      toggleProfilePermission: (profileId, permission) =>
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === profileId
              ? {
                  ...profile,
                  permissions: {
                    ...profile.permissions,
                    [permission]: !profile.permissions[permission],
                  },
                }
              : profile,
          ),
        })),
    }),
    { name: "corehub-clinic-settings" },
  ),
);
