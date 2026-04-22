import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, Film, MonitorPlay, Ticket, Settings, Bell, ChevronDown, UserCircle, LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Bảo mật sơ bộ: Nếu không đăng nhập hoặc email không có quyền (ở đây cho phép admin@nthera.vn)
  if (!user || user.email !== 'admin@nthera.vn') {
    redirect('/')
  }

  return (
    <div className="h-screen bg-[#0a0f1c] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <span className="text-black font-black text-sm">N_</span>
            </div>
            <span className="font-bold text-white tracking-widest text-lg">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-[#00f2fe] transition-all">
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Tổng quan</span>
          </Link>
          <Link href="/admin/movies" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-[#00f2fe] transition-all">
            <Film size={20} />
            <span className="font-medium text-sm">Quản lý Phim</span>
          </Link>
          <Link href="/admin/showtimes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-[#00f2fe] transition-all">
            <MonitorPlay size={20} />
            <span className="font-medium text-sm">Cụm Rạp & Suất Chiếu</span>
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-[#00f2fe] transition-all">
            <Ticket size={20} />
            <span className="font-medium text-sm">Giao dịch Vé</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-[#00f2fe] transition-all">
            <Settings size={20} />
            <span className="font-medium text-sm">Cài đặt Cấu hình</span>
          </Link>
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
           <div className="text-slate-400 font-medium text-sm">
              {/* Vùng Header trống để thanh Nav gọn gàng theo ý muốn */}
           </div>

           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-white relative hover:scale-110 transition-transform">
                 <Bell size={20} />
                 <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </button>

              <div className="h-6 w-px bg-slate-800"></div>

              {/* User Dropdown Trigger */}
              <div className="relative group cursor-pointer">
                 <div className="flex items-center gap-3 hover:bg-slate-800/50 p-1.5 pr-3 rounded-full transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-inner">
                       <UserCircle size={20} className="text-white/80" />
                    </div>
                    <div className="flex flex-col mr-2">
                       <span className="text-xs font-black text-white uppercase tracking-wider">Quản Trị Viên</span>
                       <span className="text-[10px] text-slate-400 leading-none">{user.email}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                 </div>

                 {/* Dropdown Menu */}
                 <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-800 bg-slate-800/30">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Quyền Hạn</p>
                       <p className="text-sm font-bold text-[#00f2fe]">Master Admin</p>
                    </div>
                    <div className="p-2">
                       <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <MonitorPlay size={16} /> Xem Website
                       </Link>
                       <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                          <Settings size={16} /> Cài đặt hệ thống
                       </Link>
                    </div>
                    <div className="p-2 border-t border-slate-800">
                       <form action={logout}>
                          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                             <LogOut size={16} /> Đăng xuất
                          </button>
                       </form>
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-[#0a0f1c] to-[#121b2b]">
          <div className="p-8 pb-20">
             {children}
          </div>
        </main>
      </div>
    </div>
  )
}
