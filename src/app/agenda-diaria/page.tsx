import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { DailyAgendaPageContent } from "@/modules/agendas/components/daily-agenda-page-content";

export default function DailyAgendaPage() {
  return (
    <RouteGuard path={ROUTES.dailyAgenda}>
      <DailyAgendaPageContent />
    </RouteGuard>
  );
}
