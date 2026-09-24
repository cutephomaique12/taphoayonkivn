import Shop from "@/components/Shop";
import { db } from "@/lib/db";

export const revalidate = 60;

const terms = [
  "Sản phẩm được giao qua Zalo admin sau khi hệ thống nhận đủ tiền.",
  "Nhập đúng email hoặc số điện thoại để admin liên hệ.",
  "Bảo hành theo thời gian ghi trên từng gói; liên hệ shop kèm mã đơn khi cần hỗ trợ.",
  "Không hoàn tiền khi khách đã nhận và sử dụng sản phẩm đúng mô tả.",
];
const scams = [
  "Chỉ chuyển khoản qua mã QR trên website, đúng số tiền và nội dung.",
  "Shop không nhắn tin trước để yêu cầu chuyển tiền hoặc gửi mã OTP.",
  "Chỉ nhận hàng khi bạn đã thanh toán và có mã đơn hiện trên màn hình.",
];

export default async function Home() {
  const { data } = await db.from("products").select("id,category,name,price,warranty,description").eq("active", true).order("price");
  const zalo = process.env.NEXT_PUBLIC_ZALO || "#";
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <a href="#" className="font-display text-xl tracking-wide">TẠP HÓA <span className="text-accent">YONKIVN</span></a>
          <div className="flex gap-5 text-sm text-muted">
            <a href="#san-pham" className="hover:text-white">Sản phẩm</a>
            <a href="#dieu-khoan" className="hover:text-white">Điều khoản</a>
            <a href="#lien-he" className="hover:text-white">Liên hệ</a>
          </div>
        </nav>
      </header>
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:pt-24">
          <h1 className="font-display text-5xl leading-none sm:text-7xl">KHO APP BẢN QUYỀN<br />GIÁ TỐT, GIAO NGAY.</h1>
          <p className="mt-5 max-w-xl text-muted">Chọn gói, quét mã QR, nhận mã đơn rồi nhắn Zalo admin để nhận hàng.</p>
          <a href="#san-pham" className="mt-7 inline-block rounded-full bg-accent px-6 py-3 font-semibold hover:bg-accent-d">Xem sản phẩm</a>
        </section>
        <section id="san-pham" className="mx-auto max-w-6xl px-5 py-10"><Shop products={data ?? []} /></section>
        <section id="dieu-khoan" className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="font-display text-3xl">Điều khoản mua hàng</h2>
          <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-muted">{terms.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-10">
          <div className="rounded-2xl border border-gold/40 bg-gold/5 p-6">
            <h2 className="font-display text-3xl text-gold">Cảnh báo lừa đảo</h2>
            <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-muted">{scams.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </section>
        <section id="lien-he" className="mx-auto max-w-6xl px-5 py-10 pb-20">
          <h2 className="font-display text-3xl">Liên hệ</h2>
          <p className="mt-3 text-muted">Cần hỗ trợ? Nhắn shop kèm mã đơn.</p>
          <a href={zalo} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-full border border-line bg-surface px-6 py-3 font-semibold hover:bg-surface2">Chat Zalo</a>
        </section>
      </main>
    </>
  );
}
