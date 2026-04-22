import { createClient } from '@/utils/supabase/server'
import { Ticket, Search, Calendar } from 'lucide-react'

export default async function TransactionsPage() {
  const supabase = await createClient()

  // Lấy dữ liệu vé giao dịch
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      id, total_amount, status, created_at, user_id,
      showtimes ( start_time, movies (title) )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Ticket className="text-[#00f2fe]" size={36} /> GIAO DỊCH VÉ
             </h1>
             <p className="text-slate-400 mt-2">Quản lý toàn bộ lịch sử thanh toán và xuất vé của khách hàng.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="Tìm ID Webhook..." className="bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-[#00f2fe]/50 focus:outline-none" />
             </div>
             <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Calendar size={16} /> Lọc theo Ngày
             </button>
          </div>
       </div>

       {error ? (
          <div className="text-red-500">Lỗi tải dữ liệu: {error.message}</div>
       ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <table className="w-full text-left">
                <thead className="bg-slate-800/80 text-xs uppercase font-bold text-slate-400 tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Mã Vé (Ticket ID)</th>
                      <th className="px-6 py-4">Phim & Thời gian</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Tổng Tiền</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                   {tickets?.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                         <td className="px-6 py-4 font-mono text-xs text-slate-300">{t.id}</td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-white text-sm">{t.showtimes?.movies?.title}</div>
                            <div className="text-xs text-slate-500 mt-1">{new Date(t.showtimes?.start_time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${t.status === 'PAID' ? 'bg-green-500/10 border-green-500/30 text-green-400' : t.status === 'USED' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>
                               {t.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right font-mono font-bold text-[#00f2fe]">{t.total_amount.toLocaleString()}đ</td>
                      </tr>
                   ))}
                   {(!tickets || tickets.length === 0) && (
                      <tr>
                         <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Chưa có giao dịch vé nào trong hệ thống.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       )}
    </div>
  )
}
