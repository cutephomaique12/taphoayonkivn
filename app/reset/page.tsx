"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sb } from "@/lib/supabase-browser";

export default function Reset() {
  const r = useRouter();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  async function save() {
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) return setMsg(error.message);
    r.push("/account");
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="display text-3xl">Đặt mật khẩu mới</h1>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
        className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-accent" />
      {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
      <button disabled={pw.length < 6} onClick={save} className="btn mt-4 w-full justify-center disabled:opacity-50">Lưu mật khẩu</button>
    </main>
  );
}
