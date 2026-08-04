"use client";

import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase/client";

type ServiceCall = {
  id: string;
  table_number: string;
  type: "waiter" | "bill";
  status: string;
  created_at: string;
};

export default function ServiceCallsBoard() {
  const [calls, setCalls] = useState<ServiceCall[]>([]);
  const [now, setNow] = useState(Date.now());

  const firstLoad = useRef(true);

  async function loadCalls(playSound = false) {
    const { data } = await supabase
      .from("service_calls")
      .select("*")
      .eq("status", "pending")
      .order("created_at", {
        ascending: true,
      });

    if (
      playSound &&
      !firstLoad.current &&
      (data?.length ?? 0) > calls.length
    ) {
      new Audio("/sounds/notification.mp3").play().catch(() => {});
    }

    firstLoad.current = false;

    setCalls(data ?? []);
  }

  useEffect(() => {
    void loadCalls();

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const channel = supabase
      .channel("service-calls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_calls",
        },
        () => {
          void loadCalls(true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, []);

  if (calls.length === 0) return null;

  return (
    <section className="rounded-2xl border border-red-300 bg-red-50 p-6">
      <h2 className="mb-5 text-2xl font-bold">
        🔔 Avisos de servicio
      </h2>

      <div className="space-y-3">
        {calls.map((call) => {
          const minutes = Math.floor(
            (now -
              new Date(
                call.created_at
              ).getTime()) /
              60000
          );

          const urgent =
            minutes >= 3;

          return (
            <div
              key={call.id}
              className={`
                flex
                items-center
                justify-between
                rounded-xl
                p-4
                shadow
                transition-all
                ${
                  urgent
                    ? "animate-pulse border-2 border-red-500 bg-red-100"
                    : "bg-white"
                }
              `}
            >
              <div>
                <p className="text-lg font-bold">
                  Mesa {call.table_number}
                </p>

                <p className="text-sm text-gray-500">
                  {call.type === "waiter"
                    ? "🙋 Llamar al camarero"
                    : "💶 Pedir la cuenta"}
                </p>

                <p
                  className={`mt-1 text-xs font-semibold ${
                    urgent
                      ? "text-red-700"
                      : "text-gray-500"
                  }`}
                >
                  ⏱ {minutes} min
                </p>
              </div>

              <button
                onClick={async () => {
                  await supabase
                    .from(
                      "service_calls"
                    )
                    .update({
                      status: "done",
                    })
                    .eq(
                      "id",
                      call.id
                    );

                  void loadCalls();
                }}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Atendido
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}