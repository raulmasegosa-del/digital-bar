"use client";

import { useState } from "react";

type UserItem = {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: "admin" | "waiter";
  createdAt: string;
};

type Props = { slug: string; initialUsers: UserItem[] };

export default function UsersManager({ slug, initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "waiter" as "admin" | "waiter" });

  function startCreate() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "waiter" });
    setMessage("");
    setOpen(true);
  }

  function startPasswordChange(user: UserItem) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setMessage("");
    setOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/users", {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          userId: editing?.userId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se ha podido guardar el usuario.");

      if (editing) {
        setUsers((current) => current.map((item) => item.userId === editing.userId ? data.user : item));
      } else {
        setUsers((current) => [...current, data.user]);
      }
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se ha podido guardar el usuario.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">{users.length} usuario{users.length === 1 ? "" : "s"}</p>
        </div>
        <button onClick={startCreate} className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-black hover:bg-amber-400">
          + Añadir usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181716]">
        {users.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">Todavía no hay usuarios asociados a este restaurante.</div>
        ) : users.map((user) => (
          <div key={user.id} className="flex flex-col gap-4 border-b border-zinc-800 p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white">{user.name || user.email}</span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
                  {user.role === "admin" ? "Administrador" : "Camarero"}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-zinc-500">{user.email}</p>
            </div>
            <button onClick={() => startPasswordChange(user)} className="shrink-0 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:border-amber-500/50 hover:text-amber-400">
              Editar / contraseña
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-[#181716] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">{editing ? "Editar usuario" : "Nuevo usuario"}</h2>
            <p className="mt-1 text-sm text-zinc-500">La contraseña nunca se muestra después de guardarla.</p>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-300">Nombre</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-amber-500" placeholder="Ej.: Juan García" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-300">Email / usuario</span>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" disabled={!!editing} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-amber-500 disabled:opacity-60" placeholder="juan@bar.com" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-300">Rol</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "waiter" })} className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-amber-500">
                  <option value="waiter">Camarero</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-zinc-300">{editing ? "Nueva contraseña" : "Contraseña"}</span>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} minLength={8} type="password" className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none focus:border-amber-500" placeholder="Mínimo 8 caracteres" />
              </label>
            </div>

            {message && <p className="mt-4 rounded-xl bg-red-950/50 p-3 text-sm text-red-300">{message}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300">Cancelar</button>
              <button disabled={busy} type="submit" className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-black disabled:opacity-50">{busy ? "Guardando…" : "Guardar"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
