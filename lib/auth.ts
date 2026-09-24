import { db } from "@/lib/db";

export async function userFrom(req: Request) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!t) return null;
  const { data } = await db.auth.getUser(t);
  return data.user ? { id: data.user.id, email: data.user.email! } : null;
}
