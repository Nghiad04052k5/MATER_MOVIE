import { login, signup } from './actions'
import { Mail, Lock, Film, ArrowRight } from 'lucide-react'

// Cập nhật cách lấy params bất đồng bộ cho Next.js 15+
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const message = resolvedParams?.message

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] relative overflow-hidden px-4">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f2fe] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4facfe] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 text-[#00f2fe]">
            <Film size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">N_THERA</h1>
          <p className="text-slate-400 text-sm">Hệ thống Rạp chiếu phim Thông minh</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1" htmlFor="email">
              Tên đăng nhập / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="email"
                name="email"
                type="text"
                placeholder="admin hoặc email..."
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/50 transition-all"
              />
            </div>
          </div>

          {message && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center mt-2">
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <button
              formAction={login}
              className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              Đăng Nhập
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              formAction={signup}
              className="w-full bg-transparent border border-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 hover:text-white transition-all"
            >
              Đăng ký tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
