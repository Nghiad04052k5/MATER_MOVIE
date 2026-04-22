import { Settings, Save, Database, Shield, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
       <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Settings className="text-purple-400" size={36} /> CÀI ĐẶT HỆ THỐNG
          </h1>
          <p className="text-slate-400 mt-2">Cấu hình các tham số lõi của hệ thống rạp phim N_thera (Chế độ giả lập).</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 p-6 border border-slate-800 rounded-2xl shadow-lg">
             <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="text-[#00f2fe]" size={20}/> Biểu Phí & Bán Vé</h2>
             <div className="space-y-4">
                <div>
                   <label className="text-xs text-slate-400 font-bold mb-1 block">Giá vé cơ bản (VNĐ)</label>
                   <input type="number" defaultValue={80000} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:border-[#00f2fe]" />
                </div>
                <div>
                   <label className="text-xs text-slate-400 font-bold mb-1 block">Phụ thu ghế VIP (VNĐ)</label>
                   <input type="number" defaultValue={20000} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:border-[#00f2fe]" />
                </div>
                <div>
                   <label className="text-xs text-slate-400 font-bold mb-1 block">Webhook Thanh toán (URL)</label>
                   <input type="url" defaultValue="https://nthera.vn/api/webhooks/payment" disabled className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-slate-500 cursor-not-allowed" />
                </div>
             </div>
          </div>

          <div className="bg-slate-900/50 p-6 border border-slate-800 rounded-2xl shadow-lg space-y-6">
             <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Database className="text-green-400" size={20}/> Đồng bộ Dữ liệu</h2>
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                   <div>
                      <p className="text-sm font-bold text-white">TMDB Auto Sync</p>
                      <p className="text-xs text-slate-500">Tự động kéo phim mới mỗi 24h</p>
                   </div>
                   <div className="w-10 h-6 bg-[#00f2fe] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.5)]">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-slate-900 rounded-full"></div>
                   </div>
                </div>
             </div>

             <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="text-red-400" size={20}/> Bảo mật Hệ thống</h2>
                <button className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 rounded-lg font-bold text-sm transition-colors text-left px-4">
                   Thay đổi Mật Khẩu Admin
                </button>
             </div>
          </div>
       </div>

       <div className="flex justify-start border-t border-slate-800 pt-6">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-[#00f2fe] hover:scale-105 transition-transform text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,254,0.3)]">
             <Save size={18} /> Lưu Cấu Hình
          </button>
       </div>
    </div>
  )
}
