"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/query-states";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROLE_LABELS } from "@/constants/routes";
import { useUsersQuery } from "@/modules/usuarios/users.queries";
import { getErrorMessage } from "@/services/api-error";
import type { UserRole } from "@/types/auth";

export function UsersPageContent() {
  const { data: users, isLoading, isError, error } = useUsersQuery();

  return (
    <AppShell
      title="Usuários"
      description="Gestão de usuários da clínica (apenas administradores)"
    >
      {isLoading && <TableSkeleton rows={5} columns={4} />}
      {isError && (
        <ErrorState message={getErrorMessage(error, "Erro ao carregar usuários")} />
      )}
      {users && (
        <>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário cadastrado além do administrador inicial.
            </p>
          ) : (
            <div className="rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {ROLE_LABELS[user.role as UserRole] ?? user.role}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                          {user.status === "ACTIVE" ? "Ativo" : user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
