'use client'

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { logout } from "@/app/[locale]/login/actions"; // wait, the action path might be tricky, it's a server action. 
// wait, server actions are usually imported directly from their file, no matter the locale.
// let's use the actual path. It's "@/app/[locale]/login/actions" or the original?
// I moved login to src/app/[locale]/login. So it's "@/app/[locale]/login/actions" but aliases might break if I don't use the exact path.
// Actually, let's keep it simple.

import { User } from "@supabase/supabase-js";
import { Bell, HelpCircle, Globe, Search, Ticket, MessageCircle, Camera, CheckCircle } from 'lucide-react'

export default function GlobalHeader({ user, ticketCount = 0, notifications = [] }: { user: User | null; ticketCount?: number; notifications?: any[] }) {
   const pathname = usePathname();
   const router = useRouter();
   const locale = useLocale();
   const t = useTranslations('Header');
   
   if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
      return null;
   }

   const switchLocale = (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
   };

   // Lấy danh sách notifications từ props thay vì hardcode

   return (
      <>
         <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a0f1c] to-[#0d1322] border-b border-[#00f2fe]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">

         {/* Tầng 1: Micro-nav (Thanh công cụ Topbar) */}
         <div className="flex justify-between items-center px-4 md:px-8 py-1.5 text-[11px] md:text-xs text-slate-300 border-b border-white/5 bg-black/20">
            {/* Bên Trái */}
            <div className="flex items-center gap-3">
               <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3">{t('partnerChannel')}</Link>
               <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3 hidden md:block">{t('becomePartner')}</Link>
               <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3 hidden md:block">{t('downloadApp')}</Link>
               <div className="flex items-center gap-2">
                  <span>{t('connect')}</span>
                  <Link href="#" className="hover:text-[#00f2fe]"><MessageCircle size={12} /></Link>
                  <Link href="#" className="hover:text-[#00f2fe]"><Camera size={12} /></Link>
               </div>
            </div>

            {/* Bên Phải */}
            <div className="flex items-center gap-4">
               {/* Thông Báo */}
               <div className="relative group cursor-pointer">
                  <div className="hover:text-white transition-colors flex items-center gap-1.5 py-1">
                     <div className="relative">
                        <Bell size={12} />
                        {notifications.some(n => !n.is_read) && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>}
                     </div>
                     {t('notifications')}
                  </div>
                  <div className="absolute top-full right-0 mt-0 w-80 bg-[#0a0f1c]/95 backdrop-blur-md border border-slate-700 rounded-md shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                     <div className="px-4 py-3 border-b border-slate-700 bg-white/5 flex justify-between items-center">
                        <span className="font-bold text-sm text-white">Thông báo mới</span>
                        <span className="text-[10px] text-[#00f2fe] hover:underline cursor-pointer">Đánh dấu đã đọc</span>
                     </div>
                     <div className="max-h-72 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                           <div className="p-4 text-center text-slate-400 text-xs">Không có thông báo nào.</div>
                        ) : notifications.map(n => (
                           <div key={n.id} className={`p-4 border-b border-slate-800 hover:bg-white/5 transition-colors flex gap-3 ${n.is_read ? 'opacity-70' : 'bg-blue-900/10'}`}>
                              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-[#00f2fe]'}`}></div>
                              <div>
                                 <div className={`text-sm ${n.is_read ? 'text-slate-300' : 'text-white font-semibold'}`}>{n.title}</div>
                                 <div className="text-xs text-slate-400 mt-1 line-clamp-2">{n.description}</div>
                                 <div className="text-[10px] text-slate-500 mt-1.5 font-medium">{new Date(n.created_at).toLocaleDateString('vi-VN')}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="p-3 text-center text-xs text-white hover:text-[#00f2fe] hover:bg-white/5 transition-colors border-t border-slate-700 font-medium">
                        Xem tất cả thông báo
                     </div>
                  </div>
               </div>

               {/* Hỗ Trợ */}
               <div className="relative group cursor-pointer">
                  <div className="hover:text-white transition-colors flex items-center gap-1.5 py-1">
                     <HelpCircle size={12} /> {t('support')}
                  </div>
                  <div className="absolute top-full right-0 mt-0 w-56 bg-[#0a0f1c]/95 backdrop-blur-md border border-slate-700 rounded-md shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden py-2">
                     <Link href="#" className="block px-4 py-2.5 hover:bg-white/10 text-xs transition-colors text-slate-200 hover:text-white">Câu hỏi thường gặp (FAQ)</Link>
                     <Link href="#" className="block px-4 py-2.5 hover:bg-white/10 text-xs transition-colors text-slate-200 hover:text-white">Trung tâm trợ giúp</Link>
                     <Link href="#" className="block px-4 py-2.5 hover:bg-white/10 text-xs transition-colors text-slate-200 hover:text-white">Góp ý hệ thống rạp</Link>
                     <div className="border-t border-slate-700 mt-2 pt-2 px-4 py-2 bg-white/5">
                        <div className="text-[10px] text-slate-400">Hotline:</div>
                        <div className="text-sm font-black text-[#00f2fe] mt-0.5">1900 1234</div>
                     </div>
                  </div>
               </div>

               {/* Tiếng Việt / English */}
               <div className="relative group cursor-pointer">
                  <div className="hover:text-white transition-colors flex items-center gap-1.5 py-1">
                     <Globe size={12} /> {locale === 'vi' ? 'Tiếng Việt' : 'English'}
                  </div>
                  <div className="absolute top-full right-0 mt-0 w-36 bg-[#0a0f1c]/95 backdrop-blur-md border border-slate-700 rounded-md shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden py-1">
                     <button onClick={() => switchLocale('vi')} className={`w-full text-left px-4 py-2.5 hover:bg-white/10 text-xs transition-colors flex items-center justify-between ${locale === 'vi' ? 'text-[#00f2fe] font-bold bg-white/5' : 'text-slate-200 hover:text-white'}`}>
                        Tiếng Việt {locale === 'vi' && <CheckCircle size={12} />}
                     </button>
                     <button onClick={() => switchLocale('en')} className={`w-full text-left px-4 py-2.5 hover:bg-white/10 text-xs transition-colors flex items-center justify-between ${locale === 'en' ? 'text-[#00f2fe] font-bold bg-white/5' : 'text-slate-200 hover:text-white'}`}>
                        English {locale === 'en' && <CheckCircle size={12} />}
                     </button>
                  </div>
               </div>

               {user ? (
                  <div className="flex items-center gap-3 pl-2 border-l border-slate-700 font-bold text-[#00f2fe]">
                     <span>{user.email}</span>
                     {user.email === 'admin@nthera.vn' && (
                        <Link href="/admin/movies" className="text-purple-400 hover:text-purple-300">| {t('admin')}</Link>
                     )}
                     {user.email === 'staff@nthera.vn' && (
                        <Link href="/staff/scanner" className="text-green-400 hover:text-green-300">| {t('scan')}</Link>
                     )}
                     <form action={logout} className="inline">
                        <button className="text-red-400 hover:text-red-300 ml-1">{t('logout')}</button>
                     </form>
                  </div>
               ) : (
                  <div className="flex items-center gap-3 pl-2 border-l border-slate-700 font-bold">
                     <Link href="/login" className="hover:text-white transition-colors">{t('register')}</Link>
                     <Link href="/login" className="hover:text-white transition-colors">{t('login')}</Link>
                  </div>
               )}
            </div>
         </div>

         {/* Tầng 2: Main Search Nav */}
         <div className="flex items-center px-4 md:px-8 py-4 lg:py-5 gap-6 max-w-[1400px] mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_20px_rgba(0,242,254,0.5)] flex items-center justify-center -rotate-6 hover:rotate-0 transition-transform">
                  <span className="text-black font-black text-lg md:text-xl">N_</span>
               </div>
               <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#00f2fe] hidden sm:block drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                  THERA
               </h1>
            </Link>

            {/* Main Menu */}
            <nav className="hidden lg:flex items-center gap-6 font-bold text-sm tracking-wider uppercase shrink-0">
               <Link href="/" className="hover:text-[#00f2fe] transition-colors text-slate-200">{t('nowShowing')}</Link>
               <Link href="/cinemas" className="hover:text-[#00f2fe] transition-colors text-slate-200">{t('cinemas')}</Link>
               <Link href="/offers" className="hover:text-[#00f2fe] transition-colors text-slate-200">{t('offers')}</Link>
            </nav>

            {/* Thanh Tìm Kiếm + Tags (Middle) */}
            <div className="flex-1 max-w-4xl mx-auto flex flex-col gap-1.5 w-full">
               <form action="/search" method="GET" className="flex w-full bg-white rounded-md overflow-hidden border-2 border-transparent focus-within:border-[#00f2fe] shadow-inner transition-colors">
                  <input
                     type="text"
                     name="q"
                     placeholder={t('searchPlaceholder')}
                     className="flex-1 bg-transparent px-4 py-2.5 text-black placeholder-slate-500 focus:outline-none text-sm font-medium"
                  />
                  <button type="submit" className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black px-6 md:px-8 py-2.5 flex items-center justify-center hover:opacity-90 transition-opacity m-0.5 rounded shadow-sm">
                     <Search size={18} className="font-bold" />
                  </button>
               </form>

               {/* Quick Keyword / Tags */}
               <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-hide px-1">
                  <Link href="/search?q=Shopee" className="hover:text-[#00f2fe] transition-colors">Vé siêu rẻ Shopee</Link>
                  <Link href="/search?q=lật mặt" className="hover:text-[#00f2fe] transition-colors">Lật Mặt 7: Một Điều Ước</Link>
                  <Link href="/search?q=godzilla" className="hover:text-[#00f2fe] transition-colors">Phim Hot Godzilla</Link>
                  <Link href="/search?q=dune" className="hover:text-[#00f2fe] transition-colors">Dune 2 Hành Tinh Cát</Link>
                  <Link href="/search?q=mai" className="hover:text-[#00f2fe] transition-colors">Mai (Trấn Thành)</Link>
                  <Link href="/search?q=Bắp" className="hover:text-[#00f2fe] transition-colors">Combo Bắp nước 0Đ</Link>
               </div>
            </div>

            {/* Vé Của Tôi (Giỏ Hàng Icon) */}
            <div className="shrink-0 flex items-center justify-center md:px-4">
               <Link href={user ? "/my-tickets" : "/login"} className="relative group flex items-center justify-center">
                  <Ticket size={32} className="text-white group-hover:text-[#00f2fe] transition-colors" />
                  {user && ticketCount > 0 && (
                     <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-red-500 text-white border-2 border-[#0a0f1c] text-xs font-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        {ticketCount > 9 ? '9+' : ticketCount}
                     </span>
                  )}
               </Link>
            </div>
         </div>
         </header>
         {/* Spacer to offset fixed header */}
         <div className="h-[110px] w-full shrink-0"></div>
      </>
   );
}
