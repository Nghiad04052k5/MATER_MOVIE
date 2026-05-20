import { login, signup } from './actions'
import { Mail, Lock, Film, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

// Cập nhật cách lấy params bất đồng bộ cho Next.js 15+
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const message = resolvedParams?.message as string | undefined
  const mode = (resolvedParams?.mode as string) || 'login' // 'login' | 'register'
  const isRegister = mode === 'register'
  
  const t = await getTranslations('Login')

  return (
    <div className="min-h-screen flex bg-[#0a0f1c] relative overflow-hidden">
      {/* Left side: Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0f1c] z-10"></div>
         <img src="/images/login_bg.png" alt="Cinema background" className="w-full h-full object-cover opacity-60" />
         
         {/* Overlaid Content */}
         <div className="absolute z-20 left-12 bottom-12 max-w-lg">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.5)]">
                  <Film size={24} className="text-black" />
               </div>
               <h2 className="text-3xl font-black tracking-widest text-white">N_THERA</h2>
            </div>
            <h3 className="text-4xl font-black text-white leading-tight mb-4">
               Trải Nghiệm Điện Ảnh <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-purple-400">Đỉnh Cao Tương Lai.</span>
            </h3>
            <div className="space-y-3 mt-8">
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="text-[#00f2fe]" /> <span className="font-medium">Đặt vé thần tốc không chờ đợi</span>
               </div>
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="text-[#00f2fe]" /> <span className="font-medium">Săn vé 0Đ & Ưu đãi độc quyền</span>
               </div>
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="text-[#00f2fe]" /> <span className="font-medium">Hệ thống rạp chiếu chuẩn IMAX Laser</span>
               </div>
            </div>
         </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00f2fe] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />
         
         <div className="w-full max-w-md relative z-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-10">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.5)] mb-4">
                  <Film size={24} className="text-black" />
               </div>
               <h1 className="text-2xl font-black text-white tracking-widest">N_THERA</h1>
            </div>

            {/* Form Container */}
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-2xl p-8 sm:p-10">
               
               {/* Mode Switcher */}
               <div className="flex p-1 bg-slate-950/50 rounded-xl mb-8 border border-slate-800/50">
                  <Link href="/login?mode=login" className={`flex-1 text-center py-2.5 text-sm font-bold rounded-lg transition-all ${!isRegister ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                     {t('loginBtn')}
                  </Link>
                  <Link href="/login?mode=register" className={`flex-1 text-center py-2.5 text-sm font-bold rounded-lg transition-all ${isRegister ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                     {t('signupBtn')}
                  </Link>
               </div>

               <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-2">{isRegister ? (t('signupBtn') === 'Đăng ký tài khoản' ? 'Tạo Tài Khoản Mới' : 'Create New Account') : (t('loginBtn') === 'Đăng Nhập' ? 'Chào Mừng Trở Lại' : 'Welcome Back')}</h2>
                  <p className="text-slate-400 text-sm">{t('subtitle')}</p>
               </div>

               <form className="flex flex-col gap-5">
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1" htmlFor="email">
                        {t('emailLabel')}
                     </label>
                     <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00f2fe] transition-colors" size={18} />
                        <input
                           id="email"
                           name="email"
                           type="text"
                           placeholder={t('emailPlaceholder')}
                           required
                           className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f2fe]/50 focus:ring-1 focus:ring-[#00f2fe]/50 transition-all font-medium"
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1" htmlFor="password">
                        {t('passwordLabel')}
                     </label>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00f2fe] transition-colors" size={18} />
                        <input
                           id="password"
                           name="password"
                           type="password"
                           placeholder="••••••••"
                           required
                           className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f2fe]/50 focus:ring-1 focus:ring-[#00f2fe]/50 transition-all font-medium"
                        />
                     </div>
                  </div>

                  {message && (
                     <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3 mt-2 animate-in fade-in slide-in-from-top-2">
                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                        <span className="leading-tight flex-1">{message}</span>
                     </div>
                  )}

                  <div className="mt-4">
                     {isRegister ? (
                        <button
                           formAction={signup}
                           className="w-full bg-slate-100 hover:bg-white text-black font-black py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                        >
                           <UserPlus size={18} />
                           {t('signupBtn')}
                        </button>
                     ) : (
                        <button
                           formAction={login}
                           className="w-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                        >
                           {t('loginBtn')}
                           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     )}
                  </div>
               </form>

               {/* Back to Home */}
               <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
                  <Link href="/" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">
                     &larr; Trở về trang chủ
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
