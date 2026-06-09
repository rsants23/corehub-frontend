import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { ConsentsPageContent } from "@/modules/consents/components/consents-page-content";

export default function ConsentsPage() {
  return (
    <RouteGuard path={ROUTES.consents}>
      <ConsentsPageContent />
    </RouteGuard>
  );
}
