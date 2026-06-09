import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { PortalAgendaPageContent } from "@/modules/patient-portal/components/patient-portal-pages";

export default function PortalAgendaPage() {
  return (
    <RouteGuard path={ROUTES.portalAgenda}>
      <PortalAgendaPageContent />
    </RouteGuard>
  );
}
