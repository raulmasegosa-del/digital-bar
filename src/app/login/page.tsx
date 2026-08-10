"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(
        "El correo electrónico o la contraseña no son correctos."
      );

      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Introduce tu correo electrónico para recuperar la contraseña."
      );
      return;
    }

    setResetting(true);

    const { error } =
      await supabaseClient.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

    if (error) {
      setError(
        "No se ha podido enviar el correo de recuperación."
      );

      setResetting(false);
      return;
    }

    setMessage(
      "Te hemos enviado un correo para restablecer tu contraseña."
    );

    setResetting(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">
              Digital Bar
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Acceder
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Accede a la administración de tu restaurante.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 p-4">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-900 bg-green-950/40 p-4">
              <p className="text-sm text-green-300">
                {message}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
                className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetting}
                className="text-sm font-medium text-amber-500 transition hover:text-amber-400 disabled:opacity-50"
              >
                {resetting
                  ? "Enviando..."
                  : "¿Has olvidado tu contraseña?"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}