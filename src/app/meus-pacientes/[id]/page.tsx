import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { MyPatientDetailPageContent } from "@/modules/therapist-portal/components/therapist-portal-pages";

export default async function MyPatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteGuard path={ROUTES.myPatients}>
      <MyPatientDetailPageContent patientId={id} />
    </RouteGuard>
  );
}
