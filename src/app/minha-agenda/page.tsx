import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { MyAgendaPageContent } from "@/modules/therapist-portal/components/therapist-portal-pages";

export default function MyAgendaPage() {
  return (
    <RouteGuard path={ROUTES.myAgenda}>
      <MyAgendaPageContent />
    </RouteGuard>
  );
}
