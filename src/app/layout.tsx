import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/login/actions";
import AIChatbot from "@/components/AIChatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "N_thera Smart Cinema",
  description: "Trải nghiệm rạp chiếu phim thông minh và tự động hóa với AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lấy thông tin user hiện tại từ Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-cinematic text-slate-100">
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_15px_rgba(0,242,254,0.5)] flex items-center justify-center">
              <span className="text-black font-black text-xs">N_</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">N_THERA</h1>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-[#00f2fe] transition-colors">TRANG CHỦ</Link>
            <Link href="#" className="hover:text-[#00f2fe] transition-colors">LỊCH CHIẾU</Link>
            <Link href="#" className="hover:text-[#00f2fe] transition-colors">RẠP PHIM</Link>
            <Link href="#" className="hover:text-[#00f2fe] transition-colors">ƯU ĐÃI</Link>
          </nav>

          <div>
             {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#00f2fe] font-medium hidden sm:inline-block">
                    {user.email}
                  </span>
                  {user.email === 'admin@nthera.vn' && (
                    <Link href="/admin/movies" className="px-5 py-2 rounded-full border border-[#00f2fe] text-[#00f2fe] hover:bg-[#00f2fe]/10 transition-all text-sm font-semibold">
                      Khu Quản Trị
                    </Link>
                  )}
                  {user.email === 'staff@nthera.vn' && (
                    <Link href="/staff/scanner" className="px-5 py-2 rounded-full border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all text-sm font-semibold flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       Quét Vé (Staff)
                    </Link>
                  )}
                  <Link href="/my-tickets" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all text-sm font-semibold">
                    Vé Của Tôi
                  </Link>
                  <form action={logout}>
                    <button className="px-5 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
                      Đăng Xuất
                    </button>
                  </form>
                </div>
             ) : (
                <Link href="/login" className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm font-semibold inline-block">
                  ĐĂNG NHẬP
                </Link>
             )}
          </div>
        </header>
        <main className="flex-1 mt-20">
          {children}
        </main>
        <AIChatbot />
      </body>
    </html>
  );
}
