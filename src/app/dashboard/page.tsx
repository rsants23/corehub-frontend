import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { DashboardPageContent } from "@/modules/dashboard/components/dashboard-page-content";

export default function DashboardPage() {
  return (
    <RouteGuard path={ROUTES.dashboard}>
      <DashboardPageContent />
    </RouteGuard>
  );
}
