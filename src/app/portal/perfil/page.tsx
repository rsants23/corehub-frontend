import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { PortalProfilePageContent } from "@/modules/patient-portal/components/patient-portal-pages";

export default function PortalProfilePage() {
  return (
    <RouteGuard path={ROUTES.portalProfile}>
      <PortalProfilePageContent />
    </RouteGuard>
  );
}
