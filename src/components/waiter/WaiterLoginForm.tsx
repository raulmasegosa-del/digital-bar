"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { restaurantName: string; slug: string };

export default function WaiterLoginForm({ restaurantName, slug }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
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
        body: JSON.stringify({ slug, pin }),
      });
      if (!response.ok) {
        setError("PIN incorrecto. Compruébalo e inténtalo de nuevo.");
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
        <p className="mt-2 text-sm text-slate-500">Introduce el PIN del personal</p>
      </div>
      <input
        value={pin}
        onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 8))}
        inputMode="numeric"
        autoComplete="current-password"
        type="password"
        placeholder="Ej.: 1234"
        className="w-full rounded-2xl border px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2"
        aria-label="PIN de camarero"
      />
      {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || pin.length < 4}
        className="mt-5 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white disabled:opacity-50"
      >
        {loading ? "Entrando…" : "Entrar como camarero"}
      </button>
    </form>
  );
}
