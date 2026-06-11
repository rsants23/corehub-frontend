import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AdminSharedUsersPageContent } from "@/modules/admin/components/admin-shared-users-page-content";

export default function AdminSharedUsersPage() {
  return (
    <AdminRouteGuard>
      <AdminSharedUsersPageContent />
    </AdminRouteGuard>
  );
}
