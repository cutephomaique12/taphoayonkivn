
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { data } = await db.from("orders").select("status").eq("code", code).single();
  if (!data) return Response.json({ status: "not_found" }, { status: 404 });
  const paid = data.status === "paid" || data.status === "done";
  return Response.json({
    status: paid ? "completed" : "pending",
    delivered: paid ? `Liên hệ Zalo admin để nhận hàng.\nMã của bạn là #${code}` : null,
  });
}
