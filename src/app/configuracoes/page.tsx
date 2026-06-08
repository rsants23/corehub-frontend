import { RouteGuard } from "@/components/auth/route-guard";
import { ROUTES } from "@/constants/routes";
import { SettingsPageContent } from "@/modules/configuracoes/components/settings-page-content";

export default function SettingsPage() {
  return (
    <RouteGuard path={ROUTES.settings}>
      <SettingsPageContent />
    </RouteGuard>
  );
}
