import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { ReportsPageContent } from "@/modules/relatorios/components/reports-page-content";

export default function ReportsPage() {
  return (
    <RouteGuard path={ROUTES.reports}>
      <ReportsPageContent />
    </RouteGuard>
  );
}
