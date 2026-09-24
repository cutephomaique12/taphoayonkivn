"use client";
import { useState } from "react";

type O = { code: string; amount: number; contact: string; status: string; created_at: string; products: { name: string } | null };
const LABEL: Record<string, string> = { pending: "Chờ thanh toán", paid: "Đã thanh toán, chờ giao", done: "Đã giao (đã đóng mã)" };

export default function Admin() {
  const [pw, setPw] = useState("");
  const [orders, setOrders] = useState<O[] | null>(null);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const r = await fetch("/api/admin/orders", { headers: { "x-admin-password": pw } });
    if (!r.ok) return setErr("Sai mật khẩu");
    setErr(""); setOrders(await r.json());
  }
  async function close(code: string) {
    const r = await fetch("/api/admin/orders", { method: "POST", headers: { "x-admin-password": pw, "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
    if (!r.ok) setErr((await r.json()).error);
    load();
  }

  if (!orders) return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="font-display text-3xl">Admin</h1>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mật khẩu"
        className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none" />
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <button onClick={load} className="mt-4 w-full rounded-full bg-accent py-3 font-semibold">Đăng nhập</button>
    </main>
  );

  const key = q.replace("#", "").trim().toUpperCase();
  const list = orders.filter((o) => !key || o.code.includes(key));
  return (
    <main className="mx-auto max-w-2xl p-5">
      <div className="flex items-center justify-between"><h1 className="font-display text-3xl">Đơn hàng</h1>
        <button onClick={load} className="rounded-full border border-line px-4 py-2 text-sm">Làm mới</button></div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập mã khách gửi (vd #YK1A2B3C4D5E)"
        className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none" />
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <div className="mt-4 space-y-3">
        {list.map((o) => (
          <div key={o.code} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex justify-between"><b>#{o.code}</b><span className="text-gold">{o.amount.toLocaleString("vi-VN")}đ</span></div>
            <p className="text-sm">{o.products?.name}</p>
            <p className="text-sm text-muted">{o.contact} · {new Date(o.created_at).toLocaleString("vi-VN")}</p>
            <p className="mt-1 text-sm">{LABEL[o.status] ?? o.status}</p>
            {o.status === "paid" && <button onClick={() => close(o.code)} className="mt-3 w-full rounded-full bg-accent py-2 text-sm font-semibold">Đã giao, đóng mã</button>}
          </div>
        ))}
      </div>
    </main>
  );
              }
