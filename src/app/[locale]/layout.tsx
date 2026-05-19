import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import AIChatbot from "@/components/AIChatbot";
import GlobalHeader from "@/components/GlobalHeader";
import "../globals.css";

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'vi';
  const messages = await getMessages();
  // Lấy thông tin user hiện tại từ Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let ticketCount = 0;
  let notifications = [];
  
  if (user) {
    // Đếm số lượng vé
    const { count } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['PAID', 'PENDING']);
    ticketCount = count || 0;

    // Lấy thông báo mới nhất
    const { data: notifData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (notifData) {
      notifications = notifData;
    }
  }

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-cinematic text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <GlobalHeader user={user} ticketCount={ticketCount} notifications={notifications} />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <AIChatbot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
