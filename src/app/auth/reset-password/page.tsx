"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabaseClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        setError(
          "El enlace de recuperación no es válido o ha caducado."
        );
      }

      setCheckingSession(false);
    }

    checkSession();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabaseClient.auth.updateUser({
        password,
      });

    if (error) {
      setError(
        error.message
      );
      setLoading(false);
      return;
    }

    setMessage(
      "Contraseña actualizada correctamente."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-gray-950 px-6 py-12">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
          <p className="text-sm text-gray-400">
            Comprobando enlace...
          </p>
        </div>
      </main>
    );
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
              Nueva contraseña
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Elige una nueva contraseña para tu cuenta.
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

          {!error && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-200"
                >
                  Nueva contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-gray-200"
                >
                  Repite la contraseña
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Guardando..."
                  : "Cambiar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}