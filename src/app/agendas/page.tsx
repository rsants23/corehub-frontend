import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { SchedulesPageContent } from "@/modules/agendas/components/schedules-page-content";

export default function SchedulesPage() {
  return (
    <RouteGuard path={ROUTES.schedules}>
      <SchedulesPageContent />
    </RouteGuard>
  );
}
