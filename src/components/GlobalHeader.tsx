'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { User } from "@supabase/supabase-js";
import { Bell, HelpCircle, Globe, Search, Ticket, MessageCircle, Camera } from 'lucide-react'

export default function GlobalHeader({ user }: { user: User | null }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a0f1c] to-[#0d1322] border-b border-[#00f2fe]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      
      {/* Tầng 1: Micro-nav (Thanh công cụ Topbar) */}
      <div className="flex justify-between items-center px-4 md:px-8 py-1.5 text-[11px] md:text-xs text-slate-300 border-b border-white/5 bg-black/20">
         {/* Bên Trái */}
         <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3">Kênh Đối Tác</Link>
            <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3 hidden md:block">Trở thành Đối tác N_thera</Link>
            <Link href="#" className="hover:text-white transition-colors border-r border-slate-700 pr-3 hidden md:block">Tải ứng dụng</Link>
            <div className="flex items-center gap-2">
               <span>Kết nối</span>
               <Link href="#" className="hover:text-[#00f2fe]"><MessageCircle size={12} /></Link>
               <Link href="#" className="hover:text-[#00f2fe]"><Camera size={12} /></Link>
            </div>
         </div>

         {/* Bên Phải */}
         <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Bell size={12} /> Thông Báo</Link>
            <Link href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><HelpCircle size={12} /> Hỗ Trợ</Link>
            <div className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
               <Globe size={12} /> Tiếng Việt 
            </div>
            
            {user ? (
               <div className="flex items-center gap-3 pl-2 border-l border-slate-700 font-bold text-[#00f2fe]">
                  <span>{user.email}</span>
                  {user.email === 'admin@nthera.vn' && (
                     <Link href="/admin/movies" className="text-purple-400 hover:text-purple-300">| Quản trị</Link>
                  )}
                  {user.email === 'staff@nthera.vn' && (
                     <Link href="/staff/scanner" className="text-green-400 hover:text-green-300">| Quét vé</Link>
                  )}
                  <form action={logout} className="inline">
                     <button className="text-red-400 hover:text-red-300 ml-1">Đăng Xuất</button>
                  </form>
               </div>
            ) : (
               <div className="flex items-center gap-3 pl-2 border-l border-slate-700 font-bold">
                  <Link href="/login" className="hover:text-white transition-colors">Đăng Ký</Link>
                  <Link href="/login" className="hover:text-white transition-colors">Đăng Nhập</Link>
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

         {/* Thanh Tìm Kiếm + Tags (Middle) */}
         <div className="flex-1 max-w-4xl mx-auto flex flex-col gap-1.5 w-full">
            <div className="flex w-full bg-white rounded-md overflow-hidden border-2 border-transparent focus-within:border-[#00f2fe] shadow-inner transition-colors">
               <input 
                  type="text" 
                  placeholder="Tìm kiếm phim, rạp chiếu, suất chiếu Ưu đãi 0Đ ngay hôm nay!" 
                  className="flex-1 bg-transparent px-4 py-2.5 text-black placeholder-slate-500 focus:outline-none text-sm font-medium"
               />
               <button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black px-6 md:px-8 py-2.5 flex items-center justify-center hover:opacity-90 transition-opacity m-0.5 rounded shadow-sm">
                  <Search size={18} className="font-bold" />
               </button>
            </div>
            
            {/* Quick Keyword / Tags */}
            <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-hide px-1">
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Vé siêu rẻ Shopee</Link>
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Lật Mặt 7: Một Điều Ước</Link>
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Phim Hot Godzilla</Link>
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Dune 2 Hành Tinh Cát</Link>
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Mai (Trấn Thành)</Link>
               <Link href="#" className="hover:text-[#00f2fe] transition-colors">Combo Bắp nước 0Đ</Link>
            </div>
         </div>

         {/* Vé Của Tôi (Giỏ Hàng Icon) */}
         <div className="shrink-0 flex items-center justify-center md:px-4">
            <Link href={user ? "/my-tickets" : "/login"} className="relative group flex items-center justify-center">
               <Ticket size={32} className="text-white group-hover:text-[#00f2fe] transition-colors" />
               {user && (
                 <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-red-500 text-white border-2 border-[#0a0f1c] text-xs font-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    3
                 </span>
               )}
            </Link>
         </div>
      </div>
    </header>
  );
}
