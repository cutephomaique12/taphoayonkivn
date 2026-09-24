import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

function authed(req: Request) {
  const a = Buffer.from(req.headers.get("x-admin-password") || "");
  const b = Buffer.from(process.env.ADMIN_PASSWORD || "");
  return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { data } = await db.from("orders").select("code,amount,contact,status,created_at,products(name)")
    .order("created_at", { ascending: false }).limit(200);
  return Response.json(data ?? []);
}

export async function POST(req: Request) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { code } = await req.json().catch(() => ({}));
  const { data } = await db.from("orders").update({ status: "done" })
    .eq("code", String(code || "").replace("#", "").toUpperCase()).eq("status", "paid").select("code");
  if (!data?.length) return Response.json({ error: "Mã chưa thanh toán hoặc đã đóng" }, { status: 404 });
  return Response.json({ ok: true });
}
