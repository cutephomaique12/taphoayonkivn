"use client";
import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sb } from "@/lib/supabase-browser";

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, o: object) => string; reset: () => void } }
}

export default function Login() {
  const r = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [tok, setTok] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function render() {
    if (box.current && window.turnstile && !box.current.hasChildNodes())
      window.turnstile.render(box.current, { sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, theme: "dark", callback: setTok });
  }

  async function go() {
    setBusy(true); setMsg("");
    const opt = { captchaToken: tok };
    let error: { message: string } | null = null;
    if (mode === "in") {
      error = (await sb.auth.signInWithPassword({ email, password: pw, options: opt })).error;
      if (!error) return r.push("/account");
    } else if (mode === "up") {
      const x = await sb.auth.signUp({ email, password: pw, options: opt });
      error = x.error;
      if (!error) {
        if (x.data.session) return r.push("/account");
        setMsg("Đã gửi email xác nhận. Mở email và bấm link để kích hoạt tài khoản.");
      }
    } else {
      error = (await sb.auth.resetPasswordForEmail(email, { captchaToken: tok, redirectTo: location.origin + "/reset" })).error;
      if (!error) setMsg("Đã gửi link đặt lại mật khẩu vào email (xem cả thư rác).");
    }
    if (error) setMsg(error.message);
    setBusy(false); setTok(""); window.turnstile?.reset();
  }

  const tabs: ["in" | "up" | "forgot", string][] = [["in", "Đăng nhập"], ["up", "Đăng ký"], ["forgot", "Quên mật khẩu"]];
  return (
    <main className="mx-auto max-w-sm p-6">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={render} />
      <Link href="/" className="text-sm text-muted">← Về shop</Link>
      <div className="logo mt-4">TẠP HÓA <span className="tag">YONKIVN</span></div>
      <div className="mt-5 flex gap-2">
        {tabs.map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setMsg(""); }}
            className={`rounded-full px-4 py-2 text-sm ${mode === m ? "bg-accent font-semibold text-[#100804]" : "border border-line text-muted"}`}>{l}</button>
        ))}
      </div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-accent" />
      {mode !== "forgot" && (
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          className="mt-3 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-accent" />
      )}
      <div ref={box} className="mt-4" />
      {msg && <p className="mt-3 text-sm text-gold">{msg}</p>}
      <button disabled={busy || !email} onClick={go} className="btn mt-4 w-full justify-center disabled:opacity-50">
        {busy ? "Đang xử lý…" : mode === "in" ? "Đăng nhập" : mode === "up" ? "Tạo tài khoản" : "Gửi link đặt lại mật khẩu"}
      </button>
    </main>
  );
}
