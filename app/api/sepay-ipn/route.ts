import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

const ok = () => Response.json({ success: true });

export async function POST(req: Request) {
  const key = (req.headers.get("authorization") || "").replace(/^Apikey\s+/i, "");
  const a = Buffer.from(key), b = Buffer.from(process.env.SEPAY_API_KEY || "");
  if (!b.length || a.length !== b.length || !timingSafeEqual(a, b))
    return Response.json({ success: false }, { status: 401 });

  const p = await req.json().catch(() => null);
  if (!p || p.transferType !== "in") return ok();

  const m = String(p.code || p.content || "").toUpperCase().match(/YK[0-9A-F]{10}/);
  if (!m) return ok();

  const { data: o } = await db.from("orders").select("amount,status").eq("code", m[0]).single();
  if (o && o.status === "pending" && Number(p.transferAmount) >= o.amount)
    await db.from("orders").update({ status: "paid", sepay_tx: String(p.id) }).eq("code", m[0]).eq("status", "pending");
  return ok();
}
