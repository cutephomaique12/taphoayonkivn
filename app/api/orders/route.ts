import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { userFrom } from "@/lib/auth";

export async function POST(req: Request) {
  const u = await userFrom(req);
  if (!u) return Response.json({ error: "Bạn cần đăng nhập để mua hàng" }, { status: 401 });
  const { productId, method } = await req.json().catch(() => ({}));
  const code = "YK" + randomBytes(5).toString("hex").toUpperCase();

  if (method === "wallet") {
    const { data: r } = await db.rpc("buy_with_wallet", { p_user: u.id, p_product: productId, p_code: code });
    if (r === "insufficient") return Response.json({ error: "Số dư ví không đủ, hãy nạp thêm" }, { status: 402 });
    if (r !== "ok") return Response.json({ error: "Không mua được sản phẩm này" }, { status: 400 });
    return Response.json({ code, paid: true });
  }

  const { data: p } = await db.from("products").select("id,price").eq("id", productId).eq("active", true).single();
  if (!p) return Response.json({ error: "Sản phẩm không tồn tại" }, { status: 404 });
  const { error } = await db.from("orders").insert({ code, product_id: p.id, amount: p.price, contact: u.email, user_id: u.id, method: "bank" });
  if (error) return Response.json({ error: "Không tạo được đơn" }, { status: 500 });

  const qr = `https://qr.sepay.vn/img?bank=${process.env.SEPAY_BANK}&acc=${process.env.SEPAY_ACC}&template=compact&amount=${p.price}&des=${code}`;
  return Response.json({ code, amount: p.price, qr });
}
