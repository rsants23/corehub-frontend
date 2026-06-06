"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import type { Patient } from "@/types";

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "guardianName",
    header: "Responsável",
  },
  {
    accessorKey: "insurance",
    header: "Convênio",
  },
  {
    accessorKey: "therapies",
    header: "Terapias",
    cell: ({ row }) => row.original.therapies.join(", "),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <EntityStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" aria-label="Visualizar">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

interface PatientsTableProps {
  data: Patient[];
}

export function PatientsTable({ data }: PatientsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
