import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AIChatbot from "@/components/AIChatbot";
import GlobalHeader from "@/components/GlobalHeader";
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

  let ticketCount = 0;
  if (user) {
    const { count } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['PAID', 'PENDING']);
    ticketCount = count || 0;
  }

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-cinematic text-slate-100">
        <GlobalHeader user={user} ticketCount={ticketCount} />
        <main className="flex-1 mt-[110px]">
          {children}
        </main>
        <AIChatbot />
      </body>
    </html>
  );
}
