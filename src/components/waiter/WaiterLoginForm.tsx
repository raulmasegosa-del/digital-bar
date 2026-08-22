"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { restaurantName: string; slug: string };

export default function WaiterLoginForm({ restaurantName, slug }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/waiter/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Usuario o contraseña incorrectos.");
        return;
      }
      router.replace(`/waiter/${slug}`);
      router.refresh();
    } catch {
      setError("No se ha podido iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl">
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-slate-500">Modo camarero</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">{restaurantName}</h1>
        <p className="mt-2 text-sm text-slate-500">Entra con tu usuario y contraseña</p>
      </div>
      <div className="grid gap-3">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="username"
          placeholder="usuario@restaurante.com"
          required
          className="w-full rounded-2xl border px-4 py-4 outline-none focus:ring-2"
          aria-label="Email del usuario"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          required
          className="w-full rounded-2xl border px-4 py-4 outline-none focus:ring-2"
          aria-label="Contraseña"
        />
      </div>
      {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="mt-5 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white disabled:opacity-50"
      >
        {loading ? "Entrando…" : "Entrar como camarero"}
      </button>
    </form>
  );
}
