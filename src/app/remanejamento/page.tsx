import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { RescheduleSuggestions } from "@/modules/remanejamento/components/reschedule-suggestions";
import { rescheduleSuggestionsMock } from "@/modules/remanejamento/mocks/reschedule-suggestions.mock";

export default function ReschedulingPage() {
  return (
    <AppShell
      title="Remanejamento"
      description="Sugestões automáticas de encaixe e remanejamento"
    >
      <PageHeader
        title="Sugestões de remanejamento"
        description="Analise, aprove ou rejeite as sugestões geradas pelo sistema"
      />
      <RescheduleSuggestions initialSuggestions={rescheduleSuggestionsMock} />
    </AppShell>
  );
}
