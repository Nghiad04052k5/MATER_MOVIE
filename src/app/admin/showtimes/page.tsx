import { createClient } from '@/utils/supabase/server'
import ClientShowtimeManager from './ClientShowtimeManager'
import { MapPin, MonitorPlay, CalendarDays } from 'lucide-react'

export default async function ShowtimesPage() {
   const supabase = await createClient()

   // Fetch toàn bộ Dữ liệu từ Supabase để nạp vào Form
   const { data: cinemas } = await supabase.from('cinemas').select('*').order('created_at', { ascending: true })
   const { data: movies } = await supabase.from('movies').select('*').order('created_at', { ascending: false })
   const { data: rooms } = await supabase.from('rooms').select('*, cinemas(name)').order('created_at', { ascending: false })

   // Showtimes with inner join lookup
   const { data: showtimes } = await supabase
      .from('showtimes')
      .select(`
      id, start_time, base_price,
      movies ( title ),
      rooms ( name, cinemas ( name ) )
    `)
      .order('start_time', { ascending: true })

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <MonitorPlay className="text-[#00f2fe]" /> Quản Lý Tuyến Rạp & Suất Chiếu
            </h1>
            <p className="text-slate-400 mt-2">Nơi khởi tạo Cụm Rạp, Phòng Chiếu (Tự động dàn 100 ghế ngồi), và xếp Lịch Chiếu Phim.</p>
         </div>

         {/* File Client đảm nhận render Form nhập liệu tĩnh có State */}
         <ClientShowtimeManager
            cinemas={cinemas || []}
            movies={movies || []}
            rooms={rooms || []}
         />

         {/* Hiển thị tóm tắt danh sách Suất chiếu đã xếp */}
         <div className="mt-12 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-slate-800/30">
               <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="text-[#00f2fe]" size={20} /> Danh sách Suất Chiếu đã Xếp
               </h2>
            </div>
            <div className="p-6">
               {showtimes?.length === 0 ? (
                  <p className="text-slate-500 italic text-center">Chưa có hệ thống suất chiếu nào được tạo.</p>
               ) : (
                  <div className="grid gap-4">
                     {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                     {showtimes?.map((st: any) => (
                        <div key={st.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:border-[#00f2fe]/50 transition-colors">
                           <div className="space-y-1">
                              <h3 className="font-bold text-white text-lg">{st.movies?.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-slate-400">
                                 <span className="flex items-center gap-1"><MapPin size={14} /> {st.rooms?.cinemas?.name} - {st.rooms?.name}</span>
                              </div>
                           </div>
                           <div className="mt-4 md:mt-0 text-right">
                              <div className="inline-block px-4 py-2 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe] font-mono font-bold text-lg">
                                 {new Date(st.start_time).toLocaleString('vi-VN')}
                              </div>
                              <p className="text-sm font-bold text-green-400 mt-2">Giá vé gốc: {st.base_price.toLocaleString('vi-VN')} đ</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
