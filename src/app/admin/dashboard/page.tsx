import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AdminDashboardPageContent } from "@/modules/admin/components/admin-dashboard-page-content";

export default function AdminDashboardPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboardPageContent />
    </AdminRouteGuard>
  );
}
