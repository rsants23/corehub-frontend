import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AdminClinicsPageContent } from "@/modules/admin/components/admin-clinics-page-content";

export default function AdminClinicsPage() {
  return (
    <AdminRouteGuard>
      <AdminClinicsPageContent />
    </AdminRouteGuard>
  );
}
