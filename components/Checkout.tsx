
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabase-browser";

type P = { id: string; name: string; sub: string | null; price: number };
const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function Checkout({ p, zalo, onClose }: { p: P; zalo: string; onClose: () => void }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [bal, setBal] = useState(0);
  const [qr, setQr] = useState<{ code: string; qr: string } | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sb.auth.getSession().then(async ({ data }) => {
      const t = data.session?.access_token ?? null;
      setToken(t);
      if (t) {
        const r = await fetch("/api/me", { headers: { Authorization: `Bearer ${t}` } });
        if (r.ok) setBal((await r.json()).balance);
      }
    });
  }, []);

  async function buy(method: "wallet" | "bank") {
    setBusy(true); setErr("");
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: p.id, method }) });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(d.error || "Có lỗi xảy ra");
    d.paid ? setCode(d.code) : setQr(d);
  }

  useEffect(() => {
    if (!qr || code) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/orders/${qr.code}`).then((x) => x.json()).catch(() => null);
      if (r?.status === "completed") setCode(qr.code);
    }, 3000);
    return () => clearInterval(t);
  }, [qr, code]);

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-bg2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{p.name} {p.sub && <span className="text-sm font-normal text-muted">{p.sub}</span>}</h3>
            <p className="font-bold text-gold">{vnd(p.price)}</p>
          </div>
          <button onClick={onClose} aria-label="Đóng" className="text-2xl leading-none text-muted">×</button>
        </div>

        {token === undefined ? (
          <p className="mt-5 text-sm text-muted">Đang tải…</p>
        ) : token === null ? (
          <div className="mt-5">
            <p className="text-sm text-muted">Bạn cần đăng nhập để mua hàng.</p>
            <Link href="/login" className="btn mt-4 w-full justify-center">Đăng nhập / Đăng ký</Link>
          </div>
        ) : code ? (
          <div className="mt-5">
            <p className="font-semibold text-green-400">Thanh toán thành công. Cảm ơn bạn!</p>
            <pre className="mt-3 select-all whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm">{`Liên hệ Zalo admin để nhận hàng.\nMã của bạn là #${code}`}</pre>
            <p className="mt-2 text-xs text-muted">Đơn này cũng nằm trong mục Tài khoản → Lịch sử mua hàng.</p>
            <a href={zalo} target="_blank" rel="noreferrer" className="btn mt-4 w-full justify-center">Nhắn Zalo admin</a>
          </div>
        ) : qr ? (
          <div className="mt-5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr.qr} alt="Mã QR chuyển khoản" className="mx-auto w-64 max-w-full rounded-xl bg-white" />
            <p className="mt-3 text-sm text-muted">Quét mã, giữ nguyên số tiền và nội dung <b className="text-white">{qr.code}</b></p>
            <p className="mt-2 animate-pulse text-sm text-gold">Đang chờ thanh toán…</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <button disabled={busy || bal < p.price} onClick={() => buy("wallet")} className="btn w-full justify-center disabled:opacity-40">
              Trả bằng ví shop · số dư {vnd(bal)}
            </button>
            {bal < p.price && <p className="text-xs text-muted">Số dư chưa đủ. <Link href="/account" className="text-gold underline">Nạp tiền vào ví</Link></p>}
            <button disabled={busy} onClick={() => buy("bank")} className="btn btn-ghost w-full justify-center">Chuyển khoản ngân hàng (quét QR)</button>
            {err && <p className="text-sm text-red-400">{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
      }
