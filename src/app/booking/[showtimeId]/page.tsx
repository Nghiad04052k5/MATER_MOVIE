import { createClient } from '@/utils/supabase/server'
import ClientSeatSelector from './ClientSeatSelector'
import Link from 'next/link'
import { CalendarDays, Clock, MapPin } from 'lucide-react'

export default async function BookingPage(props: { params: Promise<{ showtimeId: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // 1. Fetch thông tin Suất Chiếu hiện tại
  const { data: showtime, error: stError } = await supabase
    .from('showtimes')
    .select(`
      *,
      movies (*),
      rooms ( id, name, cinemas ( name, address ) )
    `)
    .eq('id', params.showtimeId)
    .single()

  if (stError || !showtime) {
     return <div className="text-center py-20 text-white font-bold text-xl">X Lỗi tải dữ liệu suất chiếu: {stError?.message}</div>
  }

  // 2. Fetch danh sách Toàn bộ Ghế thuộc Phòng chiếu này
  const { data: seats } = await supabase
    .from('seats')
    .select('*')
    .eq('room_id', showtime.room_id)
    .eq('status', 'AVAILABLE')

  // 3. Fetch danh sách NHỮNG GHẾ ĐÃ CÓ NGƯỜI MUA (thuộc Suất Chiếu này) (Race condition lookup)
  const { data: ticketSeats } = await supabase
    .from('ticket_seats')
    .select('seat_id')
    .eq('showtime_id', showtime.id)

  const bookedSeatIds = ticketSeats?.map(ts => ts.seat_id) || []

  // Xử lý Ngày Giờ cho UI
  const stDate = new Date(showtime.start_time)
  const timeString = stDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const dateString = stDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
       {/* HEADER: THÔNG TIN PHIM & SUẤT CHIẾU */}
       <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-900/60 p-6 rounded-3xl border border-slate-800 mb-8 backdrop-blur-md">
          <img src={showtime.movies?.poster_url} className="w-24 md:w-32 rounded-xl shadow-lg border border-slate-700" alt="poster" />
          <div className="flex-1">
             <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{showtime.movies?.title}</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#00f2fe]" /> {showtime.rooms?.cinemas?.name} - {showtime.rooms?.name}</span>
                <span className="flex items-center gap-1.5"><CalendarDays size={16} className="text-[#00f2fe]" /> {dateString}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#00f2fe]" /> {timeString}</span>
             </div>
             <p className="text-sm mt-4 text-slate-500 line-clamp-2 md:w-2/3">{showtime.movies?.description}</p>
          </div>
       </div>

       {/* BÀN GIAO CHO CLIENT COMPONENT XỬ LÝ INTERACTIVE & STATE */}
       <ClientSeatSelector 
         showtime={showtime}
         seats={seats || []}
         bookedSeatIds={bookedSeatIds}
       />
    </div>
  )
}
