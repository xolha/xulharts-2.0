"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Minha_logo, Blink } from "@/app/(src)/assets";
import Button from "../components/ui/Button";
import { authClient } from "@/lib/auth/client";
import { loginSchema } from "@/lib/validation/auth";

const translateError = (error: string): string => {
  const translations: Record<string, string> = {
    "Invalid email or password": "Email ou senha inválidos",
    "Too many requests": "Muitas tentativas. Aguarde um momento.",
    "Network error": "Erro de conexão. Tente novamente.",
  };
  return translations[error] || "Erro ao fazer login. Tente novamente.";
};

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [logoSrc, setLogoSrc] = useState(Minha_logo);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setValidationErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === "email") {
          errors.email = err.message;
        } else if (err.path[0] === "password") {
          errors.password = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    const redirectPath = searchParams.get("redirect") || "/admin/home";

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: redirectPath,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            router.push(redirectPath);
          },
          onError: (ctx) => {
            setError(translateError(ctx.error.message || "Erro ao fazer login"));
            setIsLoading(false);
          },
        }
      );
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro inesperado ao fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-rosado to-roxo flex min-h-screen justify-center items-center">
      <div className="bg-white items-center rounded-3xl p-4 w-120 justify-center">
        <div className="flex justify-center mb-4">
          <Image
            src={logoSrc}
            alt="Logo xulharts"
            width={80}
            height={80}
            onMouseOver={() => setLogoSrc(Blink)}
            onMouseOut={() => setLogoSrc(Minha_logo)}
          />
        </div>
        <h1 className="text-center text-2xl font-inria font-extrabold">
          Faz login ae
        </h1>

        {error && (
          <div className="m-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="m-2 flex flex-col gap-2">
            <div className="m-2 flex flex-col gap-1">
              <h1 className="text-[12px] font-inria pb-1">Email</h1>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`bg-gray-300 rounded-2xl p-4 ${
                  validationErrors.email ? "border-2 border-red-500" : ""
                }`}
              />
              {validationErrors.email && (
                <span className="text-red-500 text-xs ml-2">
                  {validationErrors.email}
                </span>
              )}
            </div>

            <div className="m-2 flex flex-col gap-1">
              <h1 className="text-[12px] font-inria pb-1">Senha</h1>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`bg-gray-300 rounded-2xl p-4 ${
                  validationErrors.password ? "border-2 border-red-500" : ""
                }`}
              />
              {validationErrors.password && (
                <span className="text-red-500 text-xs ml-2">
                  {validationErrors.password}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center w-full">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
