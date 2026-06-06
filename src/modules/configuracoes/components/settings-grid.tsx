import {
  Building2,
  HeartPulse,
  Shield,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settingsItems = [
  {
    title: "Dados da clínica",
    description: "Nome, CNPJ, endereço e contatos",
    icon: Building2,
  },
  {
    title: "Usuários",
    description: "Gerenciar acessos da equipe",
    icon: Users,
  },
  {
    title: "Perfis de acesso",
    description: "Permissões por função",
    icon: Shield,
  },
  {
    title: "Especialidades",
    description: "Áreas de atuação dos terapeutas",
    icon: Stethoscope,
  },
  {
    title: "Tipos de terapia",
    description: "Modalidades e duração dos atendimentos",
    icon: HeartPulse,
  },
  {
    title: "Convênios",
    description: "Planos de saúde aceitos",
    icon: Wallet,
  },
];

export function SettingsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="cursor-pointer border shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
