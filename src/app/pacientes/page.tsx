import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { PatientsPageContent } from "@/modules/pacientes/components/patients-page-content";

export default function PatientsPage() {
  return (
    <RouteGuard path={ROUTES.patients}>
      <PatientsPageContent />
    </RouteGuard>
  );
}
