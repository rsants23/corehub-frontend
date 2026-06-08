"use client";

import { useState } from "react";
import {
  Building2,
  HeartPulse,
  Shield,
  Stethoscope,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useSettings,
  useSettingsMutations,
  useTherapistSkills,
} from "@/hooks/use-settings";
import { useTherapists } from "@/hooks/use-therapists";
import { HttpError } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicSettingsStore } from "@/stores/clinic-settings-store";
import { useToastStore } from "@/stores/toast-store";

type SettingsTab =
  | "clinica"
  | "terapia"
  | "especialidades"
  | "usuarios"
  | "perfis"
  | "convenios";

const TABS: { id: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { id: "clinica", label: "Dados da clínica", icon: Building2 },
  { id: "terapia", label: "Tipos de terapia", icon: HeartPulse },
  { id: "especialidades", label: "Especialidades", icon: Stethoscope },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "perfis", label: "Perfis de acesso", icon: Shield },
  { id: "convenios", label: "Convênios", icon: Wallet },
];

const PERMISSION_LABELS: Record<string, string> = {
  pacientes: "Pacientes",
  terapeutas: "Terapeutas",
  agendas: "Agendas",
  faltas: "Faltas",
  remanejamento: "Remanejamento",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

export function SettingsPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const [activeTab, setActiveTab] = useState<SettingsTab>("clinica");
  const { therapyTypes, counts } = useSettings();
  const { createTherapyType, linkTherapistSkill } = useSettingsMutations();
  const { data: therapists } = useTherapists();

  const clinic = useClinicSettingsStore((state) => state.clinic);
  const updateClinic = useClinicSettingsStore((state) => state.updateClinic);
  const convenios = useClinicSettingsStore((state) => state.convenios);
  const addConvenio = useClinicSettingsStore((state) => state.addConvenio);
  const toggleConvenio = useClinicSettingsStore((state) => state.toggleConvenio);
  const removeConvenio = useClinicSettingsStore((state) => state.removeConvenio);
  const profiles = useClinicSettingsStore((state) => state.profiles);
  const toggleProfilePermission = useClinicSettingsStore(
    (state) => state.toggleProfilePermission,
  );

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [clinicForm, setClinicForm] = useState(clinic);
  const [newConvenio, setNewConvenio] = useState("");
  const [therapyForm, setTherapyForm] = useState({
    name: "",
    description: "",
    durationMinutes: "50",
  });
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>("");
  const [selectedTherapyTypeId, setSelectedTherapyTypeId] = useState<string>("");
  const [userForm, setUserForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const { data: therapistSkills, isLoading: skillsLoading } =
    useTherapistSkills(selectedTherapistId || null);

  const isLoading = therapyTypes.isLoading || counts.isLoading;
  const isError = therapyTypes.isError || counts.isError;

  const handleSaveClinic = () => {
    updateClinic(clinicForm);
    showToast("Dados da clínica salvos");
  };

  const handleCreateTherapyType = async () => {
    if (!therapyForm.name.trim()) {
      showToast("Informe o nome do tipo de terapia");
      return;
    }
    try {
      await createTherapyType.mutateAsync({
        name: therapyForm.name.trim(),
        description: therapyForm.description.trim() || undefined,
        durationMinutes: Number(therapyForm.durationMinutes) || 50,
      });
      setTherapyForm({ name: "", description: "", durationMinutes: "50" });
      showToast("Tipo de terapia cadastrado");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao cadastrar tipo de terapia",
      );
    }
  };

  const handleLinkSkill = async () => {
    if (!selectedTherapistId || !selectedTherapyTypeId) {
      showToast("Selecione terapeuta e tipo de terapia");
      return;
    }
    try {
      await linkTherapistSkill.mutateAsync({
        therapistId: selectedTherapistId,
        therapyTypeId: selectedTherapyTypeId,
      });
      setSelectedTherapyTypeId("");
      showToast("Especialidade vinculada ao terapeuta");
    } catch (err) {
      showToast(
        err instanceof HttpError ? err.message : "Erro ao vincular especialidade",
      );
    }
  };

  const handleSaveUser = () => {
    updateUser({
      name: userForm.name.trim() || user?.name,
      email: userForm.email.trim() || user?.email,
    });
    showToast("Dados do usuário atualizados");
  };

  const handleAddConvenio = () => {
    if (!newConvenio.trim()) return;
    addConvenio(newConvenio.trim());
    setNewConvenio("");
    showToast("Convênio adicionado");
  };

  return (
    <AppShell
      title="Configurações"
      description="Parâmetros e cadastros auxiliares do sistema"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {isLoading && activeTab !== "clinica" && activeTab !== "usuarios" && (
        <LoadingState />
      )}
      {isError && activeTab !== "clinica" && (
        <ErrorState
          message={
            (therapyTypes.error ?? counts.error) instanceof HttpError
              ? (therapyTypes.error as HttpError).message
              : "Erro ao carregar configurações."
          }
        />
      )}

      {activeTab === "clinica" && (
        <Card>
          <CardHeader>
            <CardTitle>Dados da clínica</CardTitle>
            <CardDescription>
              Informações exibidas no sistema e relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clinic-name">Nome da clínica</Label>
              <Input
                id="clinic-name"
                value={clinicForm.name}
                onChange={(e) =>
                  setClinicForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-cnpj">CNPJ</Label>
              <Input
                id="clinic-cnpj"
                value={clinicForm.cnpj}
                onChange={(e) =>
                  setClinicForm((prev) => ({ ...prev, cnpj: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-phone">Telefone</Label>
              <Input
                id="clinic-phone"
                value={clinicForm.phone}
                onChange={(e) =>
                  setClinicForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clinic-email">E-mail</Label>
              <Input
                id="clinic-email"
                type="email"
                value={clinicForm.email}
                onChange={(e) =>
                  setClinicForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clinic-address">Endereço</Label>
              <Textarea
                id="clinic-address"
                value={clinicForm.address}
                onChange={(e) =>
                  setClinicForm((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={handleSaveClinic}>Salvar alterações</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "terapia" && therapyTypes.data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Novo tipo de terapia</CardTitle>
              <CardDescription>
                Cadastre modalidades oferecidas pela clínica
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="therapy-name">Nome</Label>
                <Input
                  id="therapy-name"
                  value={therapyForm.name}
                  onChange={(e) =>
                    setTherapyForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex.: Musicoterapia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="therapy-duration">Duração (min)</Label>
                <Input
                  id="therapy-duration"
                  type="number"
                  min={15}
                  value={therapyForm.durationMinutes}
                  onChange={(e) =>
                    setTherapyForm((prev) => ({
                      ...prev,
                      durationMinutes: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="therapy-description">Descrição</Label>
                <Textarea
                  id="therapy-description"
                  value={therapyForm.description}
                  onChange={(e) =>
                    setTherapyForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="sm:col-span-3">
                <Button
                  onClick={handleCreateTherapyType}
                  disabled={createTherapyType.isPending}
                >
                  {createTherapyType.isPending ? "Salvando..." : "Cadastrar tipo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos cadastrados</CardTitle>
              <CardDescription>
                {therapyTypes.data.length} tipo(s) ativo(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {therapyTypes.data.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.durationMinutes} min</TableCell>
                      <TableCell className="text-muted-foreground">
                        {type.description ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "especialidades" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vincular especialidade</CardTitle>
              <CardDescription>
                Associe tipos de terapia aos terapeutas
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Terapeuta</Label>
                <Select
                  value={selectedTherapistId}
                  onValueChange={setSelectedTherapistId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {(therapists ?? []).map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de terapia</Label>
                <Select
                  value={selectedTherapyTypeId}
                  onValueChange={setSelectedTherapyTypeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {(therapyTypes.data ?? []).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Button
                  onClick={handleLinkSkill}
                  disabled={linkTherapistSkill.isPending}
                >
                  {linkTherapistSkill.isPending ? "Vinculando..." : "Vincular"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedTherapistId && (
            <Card>
              <CardHeader>
                <CardTitle>Especialidades do terapeuta</CardTitle>
              </CardHeader>
              <CardContent>
                {skillsLoading && <LoadingState />}
                {therapistSkills && therapistSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma especialidade vinculada ainda.
                  </p>
                )}
                {therapistSkills && therapistSkills.length > 0 && (
                  <ul className="space-y-2">
                    {therapistSkills.map((skill) => (
                      <li
                        key={skill.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      >
                        <span>{skill.therapyType.name}</span>
                        <Badge variant="secondary">
                          {skill.therapyType.durationMinutes} min
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "usuarios" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usuário logado</CardTitle>
              <CardDescription>Dados da sessão atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome</Label>
                <Input
                  id="user-name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">E-mail</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <Button onClick={handleSaveUser}>Salvar usuário</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo do sistema</CardTitle>
              <CardDescription>Totais cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between rounded-md border px-3 py-2">
                <span>Pacientes</span>
                <span className="font-medium">{counts.data?.patients ?? "—"}</span>
              </div>
              <div className="flex justify-between rounded-md border px-3 py-2">
                <span>Terapeutas</span>
                <span className="font-medium">
                  {counts.data?.therapists ?? "—"}
                </span>
              </div>
              <div className="flex justify-between rounded-md border px-3 py-2">
                <span>Tipos de terapia</span>
                <span className="font-medium">
                  {counts.data?.therapyTypes ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "perfis" && (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <CardTitle className="text-base">{profile.name}</CardTitle>
                <CardDescription>Permissões de acesso ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(profile.permissions[key])}
                      onChange={() =>
                        toggleProfilePermission(profile.id, key)
                      }
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "convenios" && (
        <Card>
          <CardHeader>
            <CardTitle>Convênios</CardTitle>
            <CardDescription>
              Planos e formas de pagamento aceitos pela clínica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={newConvenio}
                onChange={(e) => setNewConvenio(e.target.value)}
                placeholder="Nome do convênio"
                onKeyDown={(e) => e.key === "Enter" && handleAddConvenio()}
              />
              <Button onClick={handleAddConvenio} className="shrink-0">
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {convenios.map((convenio) => (
                <div
                  key={convenio.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{convenio.name}</span>
                    <Badge variant={convenio.active ? "default" : "secondary"}>
                      {convenio.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleConvenio(convenio.id)}
                    >
                      {convenio.active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConvenio(convenio.id)}
                      aria-label={`Remover ${convenio.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
