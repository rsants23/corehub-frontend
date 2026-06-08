import { AppShell } from "@/components/layout/app-shell";
import { RescheduleSuggestionsPage } from "@/modules/remanejamento/components/reschedule-suggestions";

export default function ReschedulingPage() {
  return (
    <AppShell
      title="Remanejamento"
      description="Sugestões automáticas de encaixe e remanejamento"
    >
      <RescheduleSuggestionsPage />
    </AppShell>
  );
}
