import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { AuditPageContent } from "@/modules/auditoria/components/audit-page-content";

export default function AuditPage() {
  return (
    <RouteGuard path={ROUTES.audit}>
      <AuditPageContent />
    </RouteGuard>
  );
}
