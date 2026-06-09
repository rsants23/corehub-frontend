import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AdminPlansPageContent } from "@/modules/admin/components/admin-plans-page-content";

export default function AdminPlansPage() {
  return (
    <AdminRouteGuard>
      <AdminPlansPageContent />
    </AdminRouteGuard>
  );
}
