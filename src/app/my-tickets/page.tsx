import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Ticket, MapPin, CalendarClock, Armchair } from 'lucide-react'

export default async function MyTicketsPage() {
  const supabase = await createClient()

  // Kiểm tra xác thực Khách hàng
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 1. Kéo Dữ liệu Hóa đơn (tickets) kết hợp với Toàn bộ chi tiết sâu
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      id, total_amount, created_at, status,
      showtimes ( 
         start_time,
         movies ( title, poster_url ),
         rooms ( name, cinemas ( name, address ) )
      ),
      ticket_seats (
         seats ( seat_row, seat_col, seat_type )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
     return <div className="text-center py-20 text-red-500 font-bold">Lỗi truy xuất vé: {error.message}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
       <div className="mb-12">
         <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Ticket className="text-[#00f2fe] w-10 h-10" /> HỒ SƠ ĐẶT VÉ CỦA TÔI
         </h1>
         <p className="text-slate-400 mt-2">Nơi lưu trữ lịch sử các chuyến du hành điện ảnh của bạn (Website tuân thủ quy định: Không hỗ trợ hủy/hoàn vé).</p>
       </div>

       {tickets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-700">
             <Ticket size={64} className="text-slate-600 mb-6" />
             <p className="text-xl text-slate-400 font-medium">Bạn chưa mua bất kỳ chiếc vé nào.</p>
             <Link href="/" className="mt-6 px-8 py-4 bg-[#00f2fe] text-black font-black uppercase rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                Tìm Phim Ngay
             </Link>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {tickets?.map((ticket: any) => {
                const st = ticket.showtimes
                const dateObj = new Date(st.start_time)
                const dateStr = dateObj.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                
                // Trích xuất mảng Ghế
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                const seatsInfo = ticket.ticket_seats.map((ts: any) => `${ts.seats.seat_row}${ts.seats.seat_col}`).join(', ')
                
                // Dùng ID để làm mã QR Giả lập bảo mật
                const pseudoQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`

                return (
                   <div key={ticket.id} className="relative flex bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl hover:border-[#00f2fe]/40 transition-colors">
                      {/* Vùng Cắt Viền Chấm Tròn Nét Vé (Dạng Răng Cưa) */}
                      <div className="absolute left-32 top-0 bottom-0 w-[2px] bg-transparent border-r-2 border-dashed border-slate-700 z-10"></div>
                      <div className="absolute left-[8rem] -top-3 w-6 h-6 rounded-full bg-[#0a0f1c] border-b border-slate-700 z-10"></div>
                      <div className="absolute left-[8rem] -bottom-3 w-6 h-6 rounded-full bg-[#0a0f1c] border-t border-slate-700 z-10"></div>

                      {/* KHU VỰC CỘT CHỨA QR CODE SOT VÉ CHIỀU DỌC */}
                      <div className="w-32 bg-slate-800/50 flex flex-col items-center justify-between p-4 flex-shrink-0">
                         <div className="w-full h-full flex flex-col justify-center items-center">
                            <div className="bg-white p-2 rounded-xl">
                               <img src={pseudoQRCode} alt="Mã Vạch Quét Soát Vé" className="w-full object-contain" />
                            </div>
                            <span className="text-[10px] mt-4 text-slate-500 font-mono rotate-[-90deg] whitespace-nowrap opacity-50 tracking-widest">{ticket.id.split('-')[0]}</span>
                         </div>
                      </div>

                      {/* KHU VỰC NỘI DUNG VÉ */}
                      <div className="flex-1 p-6 flex flex-col relative z-20">
                          {/* Dấu Stamp Xác nhận Đã thanh toán */}
                          <div className="absolute top-4 right-4 border-2 border-green-500 text-green-500 font-black text-xs px-2 py-1 transform rotate-12 rounded opacity-80 backdrop-blur-sm">PAID</div>
                          
                          <div className="flex gap-4 mb-4">
                             <img src={st.movies?.poster_url} className="w-20 rounded shadow-md border border-slate-700" alt="Poster" />
                             <div>
                                <h2 className="text-xl font-black text-white leading-tight mb-2 pr-12">{st.movies?.title}</h2>
                                <h3 className="text-sm font-bold text-[#00f2fe]">{st.rooms?.cinemas?.name}</h3>
                                <p className="text-xs text-slate-400 line-clamp-1">{st.rooms?.cinemas?.address}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 mt-auto">
                             <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1"><CalendarClock size={12} /> Thời gian</p>
                                <p className="font-bold text-white text-sm">{timeStr}</p>
                                <p className="text-xs text-slate-400">{dateStr}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1"><Armchair size={12} /> Ghế & Phòng</p>
                                <p className="font-bold text-[#00f2fe] tracking-widest">{seatsInfo}</p>
                                <p className="text-xs text-slate-400">{st.rooms?.name}</p>
                             </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-end border-t border-slate-800 pt-4">
                             <span className="text-xs text-slate-500">Giữ vé kỹ không bán lại</span>
                             <span className="font-mono text-xl font-black text-green-400">{ticket.total_amount.toLocaleString()}đ</span>
                          </div>
                      </div>
                   </div>
                )
             })}
          </div>
       )}
    </div>
  )
}
