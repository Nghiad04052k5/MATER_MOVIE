import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { LayoutDashboard, Film, MonitorPlay, Ticket, Settings } from 'lucide-react'

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
    <div className="min-h-screen bg-[#0a0f1c] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00f2fe] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <span className="text-black font-black text-sm">N_</span>
            </div>
            <span className="font-bold text-white tracking-widest text-lg">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Tổng quan</span>
          </Link>
          <Link href="/admin/movies" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <Film size={20} />
            <span className="font-medium text-sm">Quản lý Phim</span>
          </Link>
          <Link href="/admin/showtimes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <MonitorPlay size={20} />
            <span className="font-medium text-sm">Cụm Rạp & Suất Chiếu</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <Ticket size={20} />
            <span className="font-medium text-sm">Giao dịch Vé</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <Settings size={20} />
            <span className="font-medium text-sm">Cài đặt Cấu hình</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-3 rounded-xl bg-slate-800/50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700"></div>
             <div>
               <p className="text-xs font-bold text-white">Administrator</p>
               <p className="text-[10px] text-[#00f2fe]">{user.email}</p>
             </div>
          </div>
          <Link href="/" className="mt-4 block text-center text-xs text-slate-400 hover:text-white underline underline-offset-4">
            Quay lại Website User
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-[#0a0f1c] to-[#121b2b]">
        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  )
}
