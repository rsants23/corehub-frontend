import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { MyPatientsPageContent } from "@/modules/therapist-portal/components/therapist-portal-pages";

export default function MyPatientsPage() {
  return (
    <RouteGuard path={ROUTES.myPatients}>
      <MyPatientsPageContent />
    </RouteGuard>
  );
}
