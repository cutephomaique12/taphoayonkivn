"use client";
import { useEffect, useState } from "react";

type P = { id: string; category: string; name: string; price: number; warranty: string | null; description: string | null };
type Order = { code: string; amount: number; qr: string };

const CATS: [string, string, string][] = [
  ["ai", "Trợ lý AI", "#7c6fe4"], ["design", "Thiết kế", "#3fb0a4"], ["video", "Chỉnh sửa video", "#e4572e"],
  ["social", "Mạng xã hội", "#e86bb0"], ["game", "Fix lag game", "#4f8fe4"],
];
const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function Shop({ products }: { products: P[] }) {
  const [sel, setSel] = useState<P | null>(null);
  const [contact, setContact] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [delivered, setDelivered] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const close = () => { setSel(null); setOrder(null); setDelivered(null); setErr(""); };

  async function createOrder() {
    setBusy(true); setErr("");
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: sel!.id, contact }) });
    const d = await r.json();
    setBusy(false);
    r.ok ? setOrder(d) : setErr(d.error || "Có lỗi xảy ra");
  }

  useEffect(() => {
    if (!order || delivered) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/orders/${order.code}`).then((x) => x.json()).catch(() => null);
      if (r?.status === "completed") setDelivered(r.delivered);
    }, 3000);
    return () => clearInterval(t);
  }, [order, delivered]);

  return (
    <>
      {CATS.map(([key, label, color]) => {
        const list = products.filter((p) => p.category === key);
        if (!list.length) return null;
        return (
          <div key={key} className="mb-10">
            <h2 className="font-display mb-4 text-3xl" style={{ color }}>{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <div key={p.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5" style={{ borderTop: `3px solid ${color}` }}>
                  <h3 className="font-semibold">{p.name}</h3>
                  {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
                  <p className="mt-1 text-xs text-muted">{p.warranty}</p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-xl font-bold text-gold">{vnd(p.price)}</span>
                    <button onClick={() => setSel(p)} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold hover:bg-accent-d">Mua ngay</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={close}>
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-bg2 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-lg font-bold">{sel.name}</h3><p className="font-bold text-gold">{vnd(sel.price)}</p></div>
              <button onClick={close} aria-label="Đóng" className="text-2xl leading-none text-muted">×</button>
            </div>
            {delivered ? (
              <div className="mt-5">
                <p className="font-semibold text-green-400">Thanh toán thành công. Cảm ơn bạn!</p>
                <pre className="mt-3 whitespace-pre-wrap break-all rounded-xl bg-surface p-4 text-sm select-all">{delivered}</pre>
                <p className="mt-2 text-xs text-muted">Chụp màn hình mã này và gửi cho admin qua Zalo.</p>
                <a href={process.env.NEXT_PUBLIC_ZALO || "#"} target="_blank" rel="noreferrer" className="mt-4 block rounded-full bg-accent py-3 text-center font-semibold">Nhắn Zalo admin</a>
              </div>
            ) : order ? (
              <div className="mt-5 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.qr} alt="Mã QR chuyển khoản" className="mx-auto w-64 max-w-full rounded-xl bg-white" />
                <p className="mt-3 text-sm text-muted">Quét mã, giữ nguyên số tiền và nội dung <b className="text-white">{order.code}</b></p>
                <p className="mt-2 animate-pulse text-sm text-gold">Đang chờ thanh toán…</p>
              </div>
            ) : (
              <div className="mt-5">
                <label className="text-sm text-muted">Email hoặc số điện thoại nhận hàng</label>
                <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="ban@gmail.com hoặc 09xxxxxxxx"
                  className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-accent" />
                {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
                <button disabled={busy || !contact} onClick={createOrder} className="mt-4 w-full rounded-full bg-accent py-3 font-semibold hover:bg-accent-d disabled:opacity-50">
                  {busy ? "Đang tạo đơn…" : "Tiếp tục thanh toán"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
    }
