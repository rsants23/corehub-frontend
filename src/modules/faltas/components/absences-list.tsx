import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import type { Absence } from "@/types";

interface AbsencesListProps {
  absences: Absence[];
}

export function AbsencesList({ absences }: AbsencesListProps) {
  return (
    <div className="space-y-3">
      {absences.map((absence) => (
        <Card key={absence.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{absence.name}</CardTitle>
              <Badge variant={absence.type === "patient" ? "secondary" : "outline"}>
                {absence.type === "patient" ? "Paciente" : "Terapeuta"}
              </Badge>
            </div>
            <CardDescription>{formatDate(absence.date)}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <span className="font-medium">Motivo:</span> {absence.reason}
            </p>
            {absence.notes && (
              <p className="mt-1 text-muted-foreground">{absence.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
