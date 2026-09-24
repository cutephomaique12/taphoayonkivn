
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sb } from "@/lib/supabase-browser";

type D = {
  email: string; balance: number; nap_code: string; bank: string; acc: string;
  orders: { code: string; amount: number; status: string; method: string; created_at: string; products: { name: string } | null }[];
  txs: { amount: number; kind: string; created_at: string }[];
};
const ST: Record<string, string> = { pending: "Chờ thanh toán", paid: "Đã thanh toán, chờ giao", done: "Đã giao" };
const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
const when = (s: string) => new Date(s).toLocaleString("vi-VN");

export default function Account() {
  const r = useRouter();
  const [d, setD] = useState<D | null>(null);
  const [amt, setAmt] = useState("50000");
  const [tab, setTab] = useState<"orders" | "wallet">("orders");

  async function load() {
    const { data } = await sb.auth.getSession();
    if (!data.session) return r.replace("/login");
    const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
    if (res.ok) setD(await res.json());
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!d) return <main className="p-6 text-muted">Đang tải…</main>;
  const n = Number(amt) || 0;
  const qr = `https://qr.sepay.vn/img?bank=${d.bank}&acc=${d.acc}&template=compact&amount=${n}&des=${d.nap_code}`;

  return (
    <main className="mx-auto max-w-xl p-5 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-muted">← Về shop</Link>
        <button onClick={async () => { await sb.auth.signOut(); r.push("/"); }} className="rounded-full border border-line px-4 py-2 text-sm">Đăng xuất</button>
      </div>
      <h1 className="display mt-4 text-3xl">Tài khoản</h1>
      <p className="text-sm text-muted">{d.email}</p>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm text-muted">Số dư ví</p>
        <p className="display text-4xl text-gold">{vnd(d.balance)}</p>
        <p className="mt-4 text-sm">Nạp tiền vào ví</p>
        <input value={amt} onChange={(e) => setAmt(e.target.value.replace(/\D/g, ""))} inputMode="numeric"
          className="mt-2 w-full rounded-xl border border-line bg-bg2 px-4 py-3 outline-none focus:border-accent" />
        {n >= 2000 && (
          <div className="mt-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR nạp tiền" className="mx-auto w-56 max-w-full rounded-xl bg-white" />
            <p className="mt-3 text-sm text-muted">Giữ nguyên nội dung chuyển khoản: <b className="text-white">{d.nap_code}</b></p>
            <p className="mt-1 text-xs text-muted">Tiền vào ví sau vài giây, trang tự cập nhật.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        {([["orders", "Lịch sử mua hàng"], ["wallet", "Lịch sử ví"]] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-accent font-semibold text-[#100804]" : "border border-line text-muted"}`}>{l}</button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {tab === "orders" && (d.orders.length === 0 ? <p className="text-sm text-muted">Chưa có đơn hàng nào.</p> : d.orders.map((o) => (
          <div key={o.code} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex justify-between"><b>#{o.code}</b><span className="text-gold">{vnd(o.amount)}</span></div>
            <p className="text-sm">{o.products?.name}</p>
            <p className="text-xs text-muted">{when(o.created_at)} · {o.method === "wallet" ? "Ví shop" : "Chuyển khoản"}</p>
            <p className="mt-1 text-sm">{ST[o.status] ?? o.status}</p>
          </div>
        )))}
        {tab === "wallet" && (d.txs.length === 0 ? <p className="text-sm text-muted">Chưa có giao dịch ví.</p> : d.txs.map((t, i) => (
          <div key={i} className="flex justify-between rounded-2xl border border-line bg-surface p-4">
            <div><p className="text-sm">{t.kind === "topup" ? "Nạp tiền" : "Mua hàng"}</p><p className="text-xs text-muted">{when(t.created_at)}</p></div>
            <b className={t.amount > 0 ? "text-green-400" : "text-red-400"}>{t.amount > 0 ? "+" : ""}{vnd(t.amount)}</b>
          </div>
        )))}
      </div>
    </main>
  );
                                                   }
