"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import type { Therapist } from "@/types";

interface TherapistsTableProps {
  data: Therapist[];
  onView: (therapist: Therapist) => void;
  onEdit: (therapist: Therapist) => void;
  onRemove: (therapist: Therapist) => void;
}

export function TherapistsTable({ data, onView, onEdit, onRemove }: TherapistsTableProps) {
  const columns: ColumnDef<Therapist>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    { accessorKey: "specialty", header: "Especialidade" },
    {
      accessorKey: "weeklyHours",
      header: "Carga horária",
      cell: ({ row }) => `${row.original.weeklyHours}h/semana`,
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
