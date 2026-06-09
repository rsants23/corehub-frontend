import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { AdminClinicDetailPageContent } from "@/modules/admin/components/admin-clinic-detail-page-content";

export default async function AdminClinicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminRouteGuard>
      <AdminClinicDetailPageContent clinicId={id} />
    </AdminRouteGuard>
  );
}
