"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ADMIN_ROUTES } from "@/constants/admin-routes";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/modules/admin/schemas/admin-login.schema";
import { getErrorMessage } from "@/services/api-error";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminLoginForm() {
  const router = useRouter();
  const login = useAdminAuthStore((state) => state.login);
  const isLoading = useAdminAuthStore((state) => state.isLoading);
  const showToast = useToastStore((state) => state.showToast);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    try {
      await login(values.email, values.password);
      showToast("Login administrativo realizado com sucesso", "success");
      router.push(ADMIN_ROUTES.dashboard);
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao fazer login admin"), "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-4">
      <Card className="w-full max-w-md border-violet-200/20 shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <BrandLogo variant="full" size="lg" priority className="mx-auto" />
          <div>
            <CardTitle className="text-2xl">CoreHub Admin</CardTitle>
            <CardDescription>
              Painel Central — acesso restrito a administradores globais
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@corehub.local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar no Painel Central"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
