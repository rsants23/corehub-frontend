"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AdminShell } from "@/components/layout/admin-shell";
import { ErrorState, LoadingState } from "@/components/shared/query-states";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import { QUERY_KEYS } from "@/constants/api";
import { ROLE_LABELS } from "@/constants/routes";
import { adminApiService } from "@/modules/admin/services/admin-api.service";
import { formatDate } from "@/modules/admin/utils/format";
import type { UserRole } from "@/types/auth";

export function AdminSharedUsersPageContent() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.adminSharedUsers,
    queryFn: () => adminApiService.listSharedUsers(),
  });

  return (
    <AdminShell
      title="Usuários Compartilhados"
      description="Identidades vinculadas a mais de uma clínica"
    >
      {isLoading && <LoadingState message="Carregando usuários..." />}
      {isError && (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Erro ao carregar usuários compartilhados"
          }
        />
      )}

      {!isLoading && !isError && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Clínicas vinculadas</TableHead>
                <TableHead>Perfil por clínica</TableHead>
                <TableHead>Último acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Nenhum usuário compartilhado entre clínicas.
                  </TableCell>
                </TableRow>
              ) : (
                (data ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                        {user.username ? ` · @${user.username}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.clinics.map((clinic) => (
                          <Link
                            key={clinic.clinicId}
                            href={ADMIN_ROUTES.clinicDetail(clinic.clinicId)}
                          >
                            <Badge variant="secondary" className="hover:bg-muted">
                              {clinic.clinicName}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="space-y-1 text-sm">
                        {user.clinics.map((clinic) => (
                          <li key={clinic.membershipId}>
                            <span className="font-medium">
                              {clinic.clinicName}:
                            </span>{" "}
                            {ROLE_LABELS[clinic.role as UserRole] ?? clinic.role}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLoginAt
                        ? formatDate(user.lastLoginAt)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminShell>
  );
}
