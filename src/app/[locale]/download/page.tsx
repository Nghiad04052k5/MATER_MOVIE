import { Smartphone, Download, QrCode, CheckCircle2, ChevronRight, Play } from 'lucide-react'

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] relative overflow-hidden text-slate-200">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00f2fe] rounded-full blur-[250px] opacity-[0.07] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[250px] opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
         {/* Left: Content */}
         <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00f2fe]/30 bg-[#00f2fe]/10 text-[#00f2fe] text-xs font-black tracking-widest uppercase">
               <Smartphone size={14} /> Trải nghiệm mượt mà hơn
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
               Mang Cả Rạp Phim <br />
               Vào <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-purple-400">Túi Của Bạn.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
               Ứng dụng N_THERA mang đến trải nghiệm đặt vé thần tốc, săn deal độc quyền và quản lý tài khoản thành viên chỉ với một chạm. Giao diện Dark Mode sang trọng, hoàn hảo cho tín đồ điện ảnh.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
               {/* Nút giả lập Download */}
               <button className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 hover:border-[#00f2fe]/50 hover:bg-slate-800 p-3 rounded-2xl transition-all group w-56 shadow-xl">
                  <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-[#00f2fe]/20 group-hover:text-[#00f2fe] transition-colors"><QrCode size={28} /></div>
                  <div className="text-left flex-1">
                     <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Quét để tải</div>
                     <div className="text-sm font-black text-white">App Store</div>
                  </div>
               </button>
               
               <button className="flex items-center justify-center gap-4 bg-slate-900 border border-slate-700 hover:border-[#00f2fe]/50 hover:bg-slate-800 p-3 rounded-2xl transition-all group w-56 shadow-xl">
                  <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-[#00f2fe]/20 group-hover:text-[#00f2fe] transition-colors"><Play size={28} /></div>
                  <div className="text-left flex-1">
                     <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Quét để tải</div>
                     <div className="text-sm font-black text-white">Google Play</div>
                  </div>
               </button>
            </div>

            <div className="pt-8 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-[#00f2fe]" /> <span>Thanh toán 1 chạm qua Apple Pay / Google Pay</span>
               </div>
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-[#00f2fe]" /> <span>Lưu mã QR vé điện tử (Offline Mode)</span>
               </div>
               <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={18} className="text-[#00f2fe]" /> <span>Tích điểm thành viên tự động mỗi giao dịch</span>
               </div>
            </div>
         </div>

         {/* Right: Mockup */}
         <div className="flex-1 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-700 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2fe] to-transparent blur-[100px] opacity-20 rounded-full"></div>
            <div className="relative w-full max-w-[350px] rotate-[-5deg] hover:rotate-0 transition-transform duration-700 shadow-[0_0_50px_rgba(0,242,254,0.2)] rounded-[40px] overflow-hidden border-4 border-slate-800 bg-slate-950">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
               <img 
                 src="/images/mobile_app.png" 
                 alt="N_THERA Mobile App Mockup" 
                 className="w-full h-auto object-cover relative z-10"
               />
               <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none"></div>
            </div>
         </div>
      </div>
    </div>
  )
}
