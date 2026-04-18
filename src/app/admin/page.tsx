import { Users, Ticket, Film, Activity } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
       <div>
         <h1 className="text-3xl font-black text-white">Dashboard Tổ Tổng Quản</h1>
         <p className="text-slate-400 mt-2">Theo dõi các chỉ số hoạt động kinh doanh trực tiếp của hệ thống rạp phim.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng số vé bán" value="1,240" trend="+12.5%" icon={<Ticket size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Doanh thu hôm nay" value="24.5M" trend="+5.2%" icon={<Activity size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Phim đang chiếu" value="12" trend="0%" icon={<Film size={24} className="text-[#00f2fe]" />} />
          <StatCard title="Thành viên" value="850" trend="+18.1%" icon={<Users size={24} className="text-[#00f2fe]" />} />
       </div>

       <div className="h-96 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 flex items-center justify-center">
         <p className="text-slate-500 font-medium">Khu vực hiển thị Biểu đồ (Sẽ tích hợp sau bằng thư viện Recharts)</p>
       </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-[#00f2fe]/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-black text-white mt-1 group-hover:text-[#00f2fe] transition-colors">{value}</p>
    </div>
  )
}
