"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RealtimeTestPage() {
  const [status, setStatus] = useState("Conectando...");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    console.log("🚀 Realtime Test iniciado");

    const channel = supabase
      .channel("realtime-test")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("🔥 EVENTO RECIBIDO");
          console.log(payload);

          setEvents((prev) => [
            payload,
            ...prev,
          ]);
        }
      )
      .subscribe((state) => {
        console.log("📡 Estado:", state);
        setStatus(state);
      });

    return () => {
      console.log("🔌 Cerrando canal");
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">

        <h1 className="mb-6 text-3xl font-bold">
          Realtime Test
        </h1>

        <div className="mb-6 rounded-lg border p-4">
          <strong>Estado:</strong>{" "}
          {status}
        </div>

        <button
          onClick={() =>
            console.log(
              supabase.getChannels()
            )
          }
          className="mb-6 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Mostrar canales
        </button>

        <h2 className="mb-3 text-xl font-semibold">
          Eventos recibidos
        </h2>

        {events.length === 0 ? (
          <div className="rounded border border-dashed p-6 text-gray-500">
            Ningún evento recibido todavía...
          </div>
        ) : (
          <pre className="overflow-auto rounded bg-black p-4 text-sm text-green-400">
            {JSON.stringify(
              events,
              null,
              2
            )}
          </pre>
        )}
      </div>
    </main>
  );
}