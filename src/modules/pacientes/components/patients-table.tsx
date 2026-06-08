"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/utils/format";
import type { Patient } from "@/types";

interface PatientsTableProps {
  data: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onRemove: (patient: Patient) => void;
}

export function PatientsTable({
  data,
  onView,
  onEdit,
  onRemove,
}: PatientsTableProps) {
  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "birthDate",
      header: "Nascimento",
      cell: ({ row }) =>
        row.original.birthDate ? formatDate(row.original.birthDate) : "—",
    },
    {
      accessorKey: "notes",
      header: "Observações",
      cell: ({ row }) => row.original.notes ?? "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <EntityStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Visualizar"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Editar"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Desativar"
            onClick={() => onRemove(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
