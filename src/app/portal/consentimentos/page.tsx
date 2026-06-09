import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { PortalConsentsPageContent } from "@/modules/patient-portal/components/patient-portal-pages";

export default function PortalConsentsPage() {
  return (
    <RouteGuard path={ROUTES.portalConsents}>
      <PortalConsentsPageContent />
    </RouteGuard>
  );
}
