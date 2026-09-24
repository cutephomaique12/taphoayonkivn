import { randomBytes } from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { productId, contact } = await req.json().catch(() => ({}));
  const c = String(contact || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && !/^0\d{9}$/.test(c))
    return Response.json({ error: "Email hoặc số điện thoại không hợp lệ" }, { status: 400 });

  const { data: p } = await db.from("products").select("id,price").eq("id", productId).eq("active", true).single();
  if (!p) return Response.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });

  const code = "YK" + randomBytes(5).toString("hex").toUpperCase();
  const { error } = await db.from("orders").insert({ code, product_id: p.id, amount: p.price, contact: c });
  if (error) return Response.json({ error: "Không tạo được đơn" }, { status: 500 });

  const qr = `https://qr.sepay.vn/img?bank=${process.env.SEPAY_BANK}&acc=${process.env.SEPAY_ACC}&template=compact&amount=${p.price}&des=${code}`;
  return Response.json({ code, amount: p.price, qr });
}
