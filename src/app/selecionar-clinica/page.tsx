import { ClinicSelectForm } from "@/modules/auth/components/clinic-select-form";

export default function SelectClinicPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 p-4">
      <ClinicSelectForm />
    </div>
  );
}
