"use client";
import { useState } from "react";
import Checkout from "@/components/Checkout";

type P = { id: string; category: string; icon: string; name: string; sub: string | null; badge: string | null; badge_kind: string | null; link: string | null; price: number };

const IC: Record<string, React.ReactNode> = {
  spark: <path d="M12 3l1.8 5.6L19 10l-5.2 1.4L12 17l-1.8-5.6L5 10l5.2-1.4z" />,
  chat: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M9 9h.01M15 9h.01M9 15c.8.8 2 .8 3 0" /></>,
  brush: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.5 7.5" /><circle cx="11" cy="11" r="2" /></>,
  cam: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="M17 9l4-2v10l-4-2" /></>,
  ig: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.2" /></>,
  pad: <><rect x="2" y="8" width="20" height="9" rx="4" /><path d="M7 11v3M5.5 12.5h3M16 12h.01M18.5 10.5h.01" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
};
const CATS: [string, string, string][] = [
  ["ai", "Trợ Lý AI", "spark"], ["design", "Thiết Kế", "brush"], ["video", "Chỉnh Sửa Video", "cam"],
  ["social", "Mạng Xã Hội", "ig"], ["game", "Fix Lag Liên Quân", "pad"],
];
const k = (n: number) => (n === 0 ? "0đ" : n % 1000 === 0 ? n / 1000 + "k" : n.toLocaleString("vi-VN") + "đ");
const Svg = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{IC[n]}</svg>;

export default function Shop({ products, zalo, group }: { products: P[]; zalo: string; group: string }) {
  const [sel, setSel] = useState<P | null>(null);
  return (
    <>
      {CATS.map(([key, label, ic]) => {
        const list = products.filter((p) => p.category === key);
        if (!list.length) return null;
        const count = key === "game" ? `${list.filter((p) => p.link).length} file` : `${list.length} gói`;
        return (
          <section className="shelf" key={key}>
            <div className="shelf-head">
              <h2>
                <span className={`hi ico-${key}`}><Svg n={ic} /></span> {label}
                {key === "game" && <small style={{ color: "var(--muted2)", fontWeight: 500 }}>— mùa mới nhất</small>}
              </h2>
              <span className="count">{count}</span>
            </div>
            <div className="row">
              {list.map((p) => {
                const gold = p.icon === "check";
                return (
                  <div className="card" key={p.id} style={gold ? { borderColor: "rgba(255,193,69,.35)" } : undefined}>
                    <div className={`icon ico-${key}`} style={gold ? { background: "rgba(255,193,69,.15)", color: "var(--gold)" } : undefined}><Svg n={p.icon} /></div>
                    <h3>{p.name}{p.sub && <> <small>{p.sub}</small></>}</h3>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener" className={`badge lnk${p.badge_kind === "drive" ? " drive" : ""}`}>{p.badge}</a>
                    ) : p.badge ? (
                      <div className="meta"><span className={`badge${p.badge_kind === "kbh" ? " kbh" : ""}`}>{p.badge}</span></div>
                    ) : null}
                    <div className="price">{k(p.price)}</div>
                    {p.price > 0 && <button className="btn buy" onClick={() => setSel(p)}>Mua ngay</button>}
                  </div>
                );
              })}
            </div>
            {key === "social" && (
              <div className="note-box">
                <b>Dịch vụ nâng Locket:</b> chỉ cần gửi tên tài khoản là nâng xong ngay, không cần chờ lâu.
                <div className="chips">
                  {["Không cần iCloud", "Không đăng nhập tài khoản lạ", "Lên gói chính thức của app", "Không DNS giả"].map((c) => <span key={c} className="chip">{c}</span>)}
                </div>
              </div>
            )}
            {key === "game" && (
              <div className="note-box">
                Link vượt (lấy free) thay đổi liên tục — vào <a href={group} target="_blank" rel="noopener" style={{ color: "var(--gold)", borderBottom: "1px dotted var(--gold)" }}>nhóm Zalo</a> để cập nhật mới nhất ngay khi có, web có thể cập nhật trễ hơn nhóm một chút.<br /><br />
                <b>Lười vượt link?</b> Nhắn Zalo, admin mua giúp luôn.
              </div>
            )}
          </section>
        );
      })}
      {sel && <Checkout p={sel} zalo={zalo} onClose={() => setSel(null)} />}
    </>
  );
}    return () => clearInterval(t);
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
