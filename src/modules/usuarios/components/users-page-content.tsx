"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/query-states";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ROLE_LABELS } from "@/constants/routes";
import { useTherapists } from "@/hooks/use-therapists";
import { UserFormDialog } from "@/modules/usuarios/components/user-form-dialog";
import type { UserFormValues } from "@/modules/usuarios/schemas/user.schema";
import {
  useUserMutations,
  useUsersQuery,
  type ApiUser,
} from "@/modules/usuarios/users.queries";
import { getErrorMessage } from "@/services/api-error";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import type { UserRole } from "@/types/auth";

export function UsersPageContent() {
  const showToast = useToastStore((state) => state.showToast);
  const currentUser = useAuthStore((state) => state.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userToInactivate, setUserToInactivate] = useState<ApiUser | null>(
    null,
  );

  const { data: users, isLoading, isError, error } = useUsersQuery();
  const { data: therapists } = useTherapists();
  const { create, inactivate } = useUserMutations();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const roleOk = roleFilter === "all" || user.role === roleFilter;
      const statusOk = statusFilter === "all" || user.status === statusFilter;
      return roleOk && statusOk;
    });
  }, [users, roleFilter, statusFilter]);

  const handleCreate = async (values: UserFormValues) => {
    try {
      await create.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        therapistId: values.therapistId || undefined,
      });
      showToast("Usuário criado com sucesso");
      setDialogOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao criar usuário"), "error");
    }
  };

  const handleInactivate = async () => {
    if (!userToInactivate) return;
    try {
      await inactivate.mutateAsync(userToInactivate.id);
      showToast("Usuário inativado com sucesso");
      setUserToInactivate(null);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao inativar usuário"), "error");
    }
  };

  return (
    <AppShell
      title="Usuários"
      description="Gestão de usuários da clínica (administradores e coordenação)"
    >
      <PageHeader
        actionLabel="Novo usuário"
        onAction={() => setDialogOpen(true)}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            {(
              ["ADMIN", "COORDINATOR", "RECEPTION", "THERAPIST"] as UserRole[]
            ).map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="INACTIVE">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <TableSkeleton rows={5} columns={6} />}
      {isError && (
        <ErrorState message={getErrorMessage(error, "Erro ao carregar usuários")} />
      )}

      {users && filteredUsers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum usuário encontrado para os filtros selecionados.
        </p>
      )}

      {filteredUsers.length > 0 && (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terapeuta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {ROLE_LABELS[user.role as UserRole] ?? user.role}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "ACTIVE" ? "default" : "secondary"}
                    >
                      {user.status === "ACTIVE" ? "Ativo" : user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.therapist?.name ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {user.status === "ACTIVE" &&
                      user.id !== currentUser?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserToInactivate(user)}
                        >
                          Inativar
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        therapists={therapists ?? []}
        onSubmit={handleCreate}
        isSubmitting={create.isPending}
      />

      <ConfirmDialog
        open={Boolean(userToInactivate)}
        onOpenChange={(open) => !open && setUserToInactivate(null)}
        title="Inativar usuário"
        description={
          userToInactivate
            ? `Deseja inativar o usuário "${userToInactivate.name}" (${userToInactivate.email})? Ele não poderá mais acessar o sistema.`
            : ""
        }
        confirmLabel="Inativar"
        isLoading={inactivate.isPending}
        onConfirm={handleInactivate}
      />
    </AppShell>
  );
}
