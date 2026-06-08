import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { TherapistsPageContent } from "@/modules/terapeutas/components/therapists-page-content";

export default function TherapistsPage() {
  return (
    <RouteGuard path={ROUTES.therapists}>
      <TherapistsPageContent />
    </RouteGuard>
  );
}
