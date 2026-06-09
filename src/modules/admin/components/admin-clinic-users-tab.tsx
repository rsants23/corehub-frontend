"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Pencil, Plus, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { QUERY_KEYS } from "@/constants/api";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import { formatDateTime } from "@/modules/admin/utils/format";
import { getErrorMessage } from "@/services/api-error";
import { useToastStore } from "@/stores/toast-store";
import type { AdminClinicUser } from "@/types/admin";

const USER_ROLES = [
  { value: "ADMIN", label: "Administrador" },
  { value: "COORDINATOR", label: "Coordenador" },
  { value: "RECEPTION", label: "Recepção" },
  { value: "THERAPIST", label: "Terapeuta" },
] as const;

const USER_STATUSES = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "SUSPENDED", label: "Suspenso" },
] as const;

interface AdminClinicUsersTabProps {
  clinicId: string;
  users: AdminClinicUser[];
  canManage: boolean;
}

export function AdminClinicUsersTab({
  clinicId,
  users,
  canManage,
}: AdminClinicUsersTabProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminClinicUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminClinicUser | null>(null);

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo usuário
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Terapeuta</TableHead>
            <TableHead>Último acesso</TableHead>
            {canManage && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={canManage ? 7 : 6}
                className="text-center text-muted-foreground"
              >
                Nenhum usuário cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                clinicId={clinicId}
                user={user}
                canManage={canManage}
                onEdit={() => setEditUser(user)}
                onResetPassword={() => setPasswordUser(user)}
              />
            ))
          )}
        </TableBody>
      </Table>

      {canManage && (
        <>
          <CreateUserDialog
            clinicId={clinicId}
            open={createOpen}
            onOpenChange={setCreateOpen}
          />
          <EditUserDialog
            clinicId={clinicId}
            user={editUser}
            onClose={() => setEditUser(null)}
          />
          <ResetPasswordDialog
            clinicId={clinicId}
            user={passwordUser}
            onClose={() => setPasswordUser(null)}
          />
        </>
      )}
    </div>
  );
}

function UserRow({
  clinicId,
  user,
  canManage,
  onEdit,
  onResetPassword,
}: {
  clinicId: string;
  user: AdminClinicUser;
  canManage: boolean;
  onEdit: () => void;
  onResetPassword: () => void;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      adminApiService.updateClinicUserStatus(clinicId, user.id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminClinicUsers(clinicId),
      });
      showToast("Status do usuário atualizado", "success");
    },
    onError: (err) =>
      showToast(getErrorMessage(err, "Erro ao atualizar status"), "error"),
  });

  const roleLabel =
    USER_ROLES.find((r) => r.value === user.role)?.label ?? user.role;
  const statusLabel =
    USER_STATUSES.find((s) => s.value === user.status)?.label ?? user.status;

  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{roleLabel}</TableCell>
      <TableCell>
        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
          {statusLabel}
        </Badge>
      </TableCell>
      <TableCell>{user.therapist?.name ?? "—"}</TableCell>
      <TableCell>{formatDateTime(user.lastAccessAt)}</TableCell>
      {canManage && (
        <TableCell>
          <div className="flex flex-wrap gap-1">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="mr-1 h-3 w-3" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={onResetPassword}>
              <KeyRound className="mr-1 h-3 w-3" />
              Senha
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                statusMutation.mutate(
                  user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                )
              }
              disabled={statusMutation.isPending}
            >
              <UserX className="mr-1 h-3 w-3" />
              {user.status === "ACTIVE" ? "Inativar" : "Ativar"}
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

function CreateUserDialog({
  clinicId,
  open,
  onOpenChange,
}: {
  clinicId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "RECEPTION",
  });

  const mutation = useMutation({
    mutationFn: () => adminApiService.createClinicUser(clinicId, form),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminClinicUsers(clinicId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminClinic(clinicId),
      });
      showToast("Usuário criado com sucesso", "success");
      onOpenChange(false);
      setForm({ name: "", email: "", password: "", role: "RECEPTION" });
    },
    onError: (err) =>
      showToast(getErrorMessage(err, "Erro ao criar usuário"), "error"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo usuário da clínica</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Senha" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <div>
            <Label>Perfil</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Criando..." : "Criar usuário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({
  clinicId,
  user,
  onClose,
}: {
  clinicId: string;
  user: AdminClinicUser | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "RECEPTION",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const open = !!user;

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) return Promise.reject();
      return adminApiService.updateClinicUser(clinicId, user.id, form);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminClinicUsers(clinicId),
      });
      showToast("Usuário atualizado", "success");
      onClose();
    },
    onError: (err) =>
      showToast(getErrorMessage(err, "Erro ao atualizar usuário"), "error"),
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div>
            <Label>Perfil</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {USER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  clinicId,
  user,
  onClose,
}: {
  clinicId: string;
  user: AdminClinicUser | null;
  onClose: () => void;
}) {
  const showToast = useToastStore((s) => s.showToast);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) return Promise.reject();
      if (password !== confirm) {
        return Promise.reject(new Error("As senhas não conferem."));
      }
      return adminApiService.resetClinicUserPassword(clinicId, user.id, password);
    },
    onSuccess: () => {
      showToast("Senha redefinida com sucesso", "success");
      setPassword("");
      setConfirm("");
      onClose();
    },
    onError: (err) =>
      showToast(
        err instanceof Error ? err.message : getErrorMessage(err, "Erro ao redefinir senha"),
        "error",
      ),
  });

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redefinir senha — {user.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Nova senha" type="password" value={password} onChange={setPassword} />
          <Field label="Confirmar senha" type="password" value={confirm} onChange={setConfirm} />
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || password.length < 6}
          >
            {mutation.isPending ? "Salvando..." : "Redefinir senha"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
