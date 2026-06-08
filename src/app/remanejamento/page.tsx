import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { ROUTES } from "@/constants/routes";
import { RescheduleSuggestionsPage } from "@/modules/remanejamento/components/reschedule-suggestions";

export default function ReschedulingPage() {
  return (
    <RouteGuard path={ROUTES.rescheduling}>
      <AppShell
        title="Remanejamento"
        description="Sugestões automáticas de encaixe e remanejamento"
      >
        <RescheduleSuggestionsPage />
      </AppShell>
    </RouteGuard>
  );
}
