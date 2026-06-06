import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsGrid } from "@/modules/configuracoes/components/settings-grid";

export default function SettingsPage() {
  return (
    <AppShell
      title="Configurações"
      description="Parâmetros e cadastros auxiliares do sistema"
    >
      <PageHeader
        title="Configurações gerais"
        description="Gerencie dados da clínica, usuários e cadastros base"
      />
      <SettingsGrid />
    </AppShell>
  );
}
