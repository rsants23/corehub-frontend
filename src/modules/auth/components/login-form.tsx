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
import { getHomeRouteForRole, ROUTES } from "@/constants/routes";
import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/schemas/login.schema";
import { getErrorMessage } from "@/services/api-error";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const showToast = useToastStore((state) => state.showToast);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values.identifier, values.password);
      if (result === "selection_required") {
        router.push(ROUTES.selectClinic);
        return;
      }
      showToast("Login realizado com sucesso", "success");
      const role = useAuthStore.getState().user?.role;
      router.push(getHomeRouteForRole(role));
    } catch (err) {
      showToast(getErrorMessage(err, "Erro ao fazer login"), "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <BrandLogo variant="full" size="lg" priority className="mx-auto" />
          <div>
            <CardTitle className="text-2xl">Bem-vindo ao Efata CoreHub</CardTitle>
            <CardDescription>
              Utilize seu usuário ou e-mail cadastrado.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário ou E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin ou seu@email.com"
                        autoComplete="username"
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
                      <Input
                        type="password"
                        placeholder="••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
