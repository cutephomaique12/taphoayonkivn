
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase-browser";

export default function NavAuth() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setOn(!!data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setOn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (on === null) return null;
  return on
    ? <Link href="/account" className="btn btn-ghost">Tài khoản</Link>
    : <Link href="/login" className="btn btn-ghost">Đăng nhập</Link>;
}
