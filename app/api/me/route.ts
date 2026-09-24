import { db } from "@/lib/db";
import { userFrom } from "@/lib/auth";

export async function GET(req: Request) {
  const u = await userFrom(req);
  if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const [p, o, t] = await Promise.all([
    db.from("profiles").select("balance,nap_code").eq("id", u.id).single(),
    db.from("orders").select("code,amount,status,method,created_at,products(name)").eq("user_id", u.id).order("created_at", { ascending: false }).limit(50),
    db.from("wallet_tx").select("amount,kind,created_at").eq("user_id", u.id).order("created_at", { ascending: false }).limit(50),
  ]);
  return Response.json({
    email: u.email, balance: p.data?.balance ?? 0, nap_code: p.data?.nap_code,
    bank: process.env.SEPAY_BANK, acc: process.env.SEPAY_ACC,
    orders: o.data ?? [], txs: t.data ?? [],
  });
}
