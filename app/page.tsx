import Shop from "@/components/Shop";
import NavAuth from "@/components/NavAuth";
import TermsGate, { ReopenTerms } from "@/components/TermsGate";
import { db } from "@/lib/db";

export const revalidate = 60;

const ZALO = process.env.NEXT_PUBLIC_ZALO || "https://zaloapp.com/qr/p/1a1bfxwxq4o9m?src=qr";
const GROUP = "https://zalo.me/g/ikuab9j5ahd8qbiq0hnp";

const Chat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
);

const warns: [string, string][] = [
  ["Chỉ tin duy nhất 1 Zalo", `Shop chỉ nhận đơn qua đúng link Zalo trên trang này. Mọi "shop nhánh", "shop phụ" xưng là YonkiVN đều là giả mạo.`],
  ["Xác nhận đơn trước khi chuyển", "Luôn chốt rõ tên sản phẩm, giá, thời hạn bảo hành với shop trước khi chuyển khoản. Đừng chuyển khi còn mơ hồ."],
  ["Cảnh giác giá \"rẻ bất thường\"", "Nếu thấy ai mạo danh shop rao giá thấp hơn nhiều so với bảng giá này, khả năng cao là lừa đảo."],
  ["Không chia sẻ OTP/mật khẩu", "Shop không bao giờ hỏi mã OTP ngân hàng hay mật khẩu ví của bạn. Ai hỏi những thứ này chắc chắn không phải shop."],
];

export default async function Home() {
  const { data } = await db.from("products").select("id,category,icon,name,sub,badge,badge_kind,link,price").eq("active", true).order("sort");
  return (
    <>
      <TermsGate />

      <header className="nav">
        <div className="wrap nav-row">
          <div className="logo">TẠP HÓA <span className="tag">YONKIVN</span></div>
          <nav className="nav-links">
            <a href="#sanpham">Sản phẩm</a>
            <a href="#canhbao">Cảnh báo lừa đảo</a>
            <a href="#lienhe">Liên hệ</a>
          </nav>
          <div style={{ display: "flex", gap: 8 }}>
            <NavAuth />
            <a className="btn" href={ZALO} target="_blank" rel="noopener">Đặt hàng qua Zalo</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="hero-badge">✅ Bản chính thức · Giao trong ngày · Bảo hành rõ ràng</div>
          <h1 className="hero-title display">Kho App Bản Quyền, Giá Sinh Viên</h1>
          <p className="lede">Gemini, ChatGPT, Canva, CapCut, Locket... hàng chuẩn, giá tốt, chỉ giao dịch qua Zalo chính chủ để bạn yên tâm mua sắm.</p>
          <div className="hero-ctas">
            <a className="btn" href={ZALO} target="_blank" rel="noopener">💬 Nhắn Zalo đặt hàng</a>
            <a className="btn btn-ghost" href="#sanpham">Xem bảng giá</a>
          </div>
          <div className="trust-row">
            <span><i className="dot"></i> Bảo hành theo từng gói</span>
            <span><i className="dot"></i> Chỉ nhận đơn qua Zalo — tránh giả mạo</span>
            <span><i className="dot"></i> 1 chủ shop trực tiếp xử lý</span>
          </div>
        </div>
      </section>

      <main id="sanpham">
        <div className="wrap"><Shop products={data ?? []} zalo={ZALO} group={GROUP} /></div>
      </main>

      <section className="shelf" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="shelf-head">
            <h2>💳 Thanh Toán Bằng Thẻ Cào</h2>
            <span className="count">Áp dụng mọi sản phẩm</span>
          </div>
          <div className="note-box" style={{ marginTop: 0 }}>
            Shop nhận thanh toán bằng thẻ điện thoại các mệnh giá (10k/20k/50k/100k/200k). Do phải quy đổi thẻ sang tiền mặt nên giá sẽ cao hơn giá tiền mặt niêm yết, mức chênh lệch tuỳ mệnh giá và thời điểm.
            <br /><br />
            <b>Vui lòng nhắn Zalo cho admin để nhận báo giá chính xác trước khi mua</b> — shop không niêm yết sẵn tỷ lệ quy đổi trên web để tránh sai lệch so với giá thực tế.
          </div>
        </div>
      </section>

      <section className="warn" id="canhbao">
        <div className="wrap">
          <div className="warn-head">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" width="20" height="20"><path d="M12 3L2 20h20L12 3z" /><path d="M12 10v4M12 17h.01" /></svg></div>
            <h2 className="display">Cảnh Báo Lừa Đảo</h2>
          </div>
          <div className="warn-grid">
            {warns.map(([t, d]) => (
              <div className="warn-item" key={t}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                <p><b>{t}</b>{d}</p>
              </div>
            ))}
          </div>
          <div className="zalo-only">
            💬 <b>Đặt hàng an toàn:</b>&nbsp;
            <a href={ZALO} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 700 }}>zaloapp.com/qr/p/1a1bfxwxq4o9m</a>
          </div>
          <div className="zalo-only" style={{ marginTop: 10, background: "rgba(124,111,228,.1)", borderColor: "rgba(124,111,228,.3)" }}>
            📢 <b>Nhóm Zalo thông báo, cập nhật link mới nhất:</b>&nbsp;
            <a href={GROUP} target="_blank" rel="noopener" style={{ color: "var(--ai)", fontWeight: 700 }}>zalo.me/g/ikuab9j5ahd8qbiq0hnp</a>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="wrap about-grid">
          <div>
            <h2>Về Tạp Hóa YonkiVN</h2>
            <p>Shop chuyên cung cấp tài khoản và gói dịch vụ premium giá tốt cho học sinh, sinh viên: AI, thiết kế, chỉnh sửa video, mạng xã hội. Toàn bộ sản phẩm (trừ Locket) được nhập hàng và bảo hành bởi <b style={{ color: "var(--text)" }}>Lê Minh Kha</b>. Riêng Locket bảo hành 1 năm bởi <b style={{ color: "var(--text)" }}>Vanquy.com</b>.</p>
            <p className="supply-note">Nguồn hàng: playersgame.net (trừ Locket).</p>
          </div>
          <div className="disclaimer">
            <b>Miễn trừ trách nhiệm</b>
            <p style={{ marginTop: 8 }}>Shop đóng vai trò trung gian cung cấp tài khoản/gói dịch vụ từ nhà cung cấp. Các rủi ro phát sinh từ thay đổi chính sách của bên thứ 3 (Google, OpenAI, Canva, CapCut, Locket...) nằm ngoài khả năng kiểm soát của shop. Vui lòng đọc kỹ điều khoản bảo hành từng sản phẩm trước khi mua.</p>
          </div>
        </div>
      </section>

      <footer id="lienhe">
        <div className="wrap foot-row">
          <div className="foot-msg">
            <div className="logo" style={{ marginBottom: 10 }}>TẠP HÓA <span className="tag">YONKIVN</span></div>
            <p>Cảm ơn quý khách đã tin tưởng ủng hộ shop 🧡</p>
            <p>Hiện chỉ có một mình chủ shop trực tiếp xử lý đơn, nếu rep tin nhắn hơi trễ mong quý khách thông cảm ạ.</p>
          </div>
          <div className="social">
            <a href={ZALO} target="_blank" rel="noopener" aria-label="Zalo"><Chat /></a>
            <a href="https://youtube.com/@yonkivnofficial?si=A6ZGd4jWZaNFzk3o" target="_blank" rel="noopener" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://www.tiktok.com/@yonkivnofficial?_r=1&_t=ZS-99wUN1Fqx0bk" target="_blank" rel="noopener" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3c.5 2.5 2.2 4 4.7 4.2V10c-1.7 0-3.3-.5-4.7-1.5v6.8a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v2.6a3 3 0 103 3V3h1.8z" /></svg>
            </a>
          </div>
        </div>
        <div className="wrap copyright">© 2026 Tạp Hóa YonkiVN. Giá có thể thay đổi tuỳ thời điểm — vui lòng nhắn Zalo để chốt giá mới nhất. · <ReopenTerms /></div>
      </footer>

      <a className="float-zalo" href={ZALO} target="_blank" rel="noopener"><Chat /> Zalo</a>
    </>
  );
                }
