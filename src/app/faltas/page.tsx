import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { AbsencesPageContent } from "@/modules/faltas/components/absences-page-content";

export default function AbsencesPage() {
  return (
    <RouteGuard path={ROUTES.absences}>
      <AbsencesPageContent />
    </RouteGuard>
  );
}
