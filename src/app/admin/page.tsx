import { Users, Ticket, Film, Activity, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8 relative">
       {/* Ambient Glow */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2fe]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
       <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

       <div>
         <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-[#00f2fe] to-[#4facfe] rounded-full inline-block shadow-[0_0_15px_rgba(0,242,254,0.5)]"></span>
            Overview Dashboard
         </h1>
         <p className="text-slate-400 mt-2 ml-5">Theo dõi các chỉ số hoạt động kinh doanh trực tiếp của hệ thống rạp phim N_thera.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng số vé bán" value="1,240" trend="+12.5%" icon={<Ticket size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Doanh thu hôm nay" value="24.5M" trend="+5.2%" icon={<Activity size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Phim đang chiếu" value="12" trend="0%" icon={<Film size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Thành viên" value="850" trend="+18.1%" icon={<Users size={24} className="text-[#00f2fe]" />} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><TrendingUp size={18} className="text-[#00f2fe]" /> Lưu lượng giao dịch</h3>
                <div className="text-xs font-bold text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">Tháng này</div>
             </div>
             <div className="flex-1 flex items-center justify-center border border-dashed border-slate-700 rounded-2xl bg-white/5">
                <p className="text-slate-500 font-medium text-sm">Biểu đồ Recharts Chart Data (Coming Soon)</p>
             </div>
          </div>

          <div className="h-96 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col shadow-xl">
             <h3 className="text-white font-bold text-lg mb-6">Phim Thịnh Hành</h3>
             <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {/* Dummy List */}
                {[1,2,3,4].map((i) => (
                   <div key={i} className="flex items-center gap-4 bg-slate-800/30 p-3 rounded-xl border border-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-16 bg-slate-700 rounded-lg shrink-0 overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 animate-pulse"></div>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-200">Movie Title #{i}</p>
                         <p className="text-xs text-[#00f2fe] mt-1">+{(5-i)*120} Vé hôm nay</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl hover:border-[#00f2fe]/30 transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_rgba(0,242,254,0.1)] hover:-translate-y-1 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00f2fe]/5 rounded-full blur-[30px] group-hover:bg-[#00f2fe]/20 transition-all duration-500"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider border ${isPositive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
         <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
         <p className="text-3xl font-black text-white mt-1 group-hover:text-[#00f2fe] transition-colors drop-shadow-sm">{value}</p>
      </div>
    </div>
  )
}
