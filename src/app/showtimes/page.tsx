import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Calendar, MapPin, MonitorPlay } from 'lucide-react'

export default async function ShowtimesPage() {
  const supabase = await createClient()

  // Lấy danh sách suất chiếu
  const { data: showtimes } = await supabase
    .from('showtimes')
    .select(`
      id, start_time, base_price,
      movies ( id, title, poster_url ),
      rooms ( name, cinemas ( name, address ) )
    `)
    .order('start_time', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-12 text-center">
         <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">LỊCH CHIẾU PHIM HÔM NAY</h1>
         <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Chọn bộ phim yêu thích và rạp chiếu gần bạn nhất để tận hưởng trải nghiệm điện ảnh tuyệt vời tại hệ thống N_Thera Smart Cinema.</p>
         <div className="w-24 h-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)]"></div>
      </div>

      {!showtimes || showtimes.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-700 bg-slate-900/40 rounded-3xl">
           <MonitorPlay size={48} className="text-slate-600 mb-4" />
           <p className="text-xl text-slate-500">Hiện tại chưa có suất chiếu nào được lên lịch.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showtimes.map((st: any) => {
               const date = new Date(st.start_time)
               const timeString = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
               const dateString = date.toLocaleDateString('vi-VN')

               return (
                 <Link href={`/booking/${st.id}`} key={st.id} className="group flex flex-col bg-slate-900/60 rounded-3xl border border-slate-800 hover:border-[#00f2fe]/50 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden">
                       <img src={st.movies?.poster_url || '/placeholder.jpg'} alt={st.movies?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white truncate">{st.movies?.title}</h3>
                       </div>
                    </div>
                    <div className="p-6">
                       <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-4">
                          <div>
                            <p className="text-3xl font-black text-[#00f2fe]">{timeString}</p>
                            <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1"><Calendar size={14} /> {dateString}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Giá vé từ</p>
                            <p className="text-lg font-bold text-green-400">{st.base_price.toLocaleString()}đ</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-3 text-sm text-slate-300 items-start">
                          <MapPin size={18} className="text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white">{st.rooms?.cinemas?.name} <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-[#00f2fe] ml-2">{st.rooms?.name}</span></p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{st.rooms?.cinemas?.address}</p>
                          </div>
                       </div>
                       
                       <div className="mt-6">
                          <div className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-center group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:text-black transition-all">
                             ĐẶT VÉ NGAY
                          </div>
                       </div>
                    </div>
                 </Link>
               )
            })}
         </div>
      )}
    </div>
  )
}
