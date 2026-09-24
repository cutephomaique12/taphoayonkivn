import type { Metadata } from "next";
import { Anton, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const anton = Anton({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-anton" });
const be = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"], variable: "--font-be" });

export const metadata: Metadata = { title: "Tạp Hóa YonkiVN — Kho App Bản Quyền Giá Tốt" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${anton.variable} ${be.variable}`}>
      <body>{children}</body>
    </html>
  );
}
