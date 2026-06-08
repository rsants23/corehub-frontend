import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { UsersPageContent } from "@/modules/usuarios/components/users-page-content";

export default function UsersPage() {
  return (
    <RouteGuard path={ROUTES.users}>
      <UsersPageContent />
    </RouteGuard>
  );
}
