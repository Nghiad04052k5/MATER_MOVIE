import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Calendar, Clock, Star, PlayCircle, Building2 } from 'lucide-react'

// Render Server page từ DB
export default async function MovieDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  // 1. Lấy thông tin Phim
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!movie) {
    return <div className="text-center py-20 font-bold text-xl text-white">X Không tìm thấy Dữ liệu phim này.</div>
  }

  // 2. Lấy danh sách Suất chiếu theo Phim (JOIN với bảng rooms và cinemas)
  const { data: showtimes } = await supabase
    .from('showtimes')
    .select(`
      id, start_time, base_price,
      rooms ( id, name, cinemas ( name, address ) )
    `)
    .eq('movie_id', params.id)
    .order('start_time', { ascending: true })

  // Phân loại suất chiếu theo Rạp để render cho đẹp
  const groupedCinemas: Record<string, any[]> = {}
  showtimes?.forEach((st: any) => {
     const cinemaName = st.rooms?.cinemas?.name || 'Rạp Không Tên'
     if (!groupedCinemas[cinemaName]) groupedCinemas[cinemaName] = []
     groupedCinemas[cinemaName].push(st)
  })

  return (
    <div>
       {/* Hero Section */}
       <div className="relative h-[60vh] min-h-[500px] w-full flex items-end pb-12">
          {/* Background Poster Blur */}
          <div className="absolute inset-0 overflow-hidden">
             <img src={movie.poster_url} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="bg" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row gap-8 items-end">
             <img 
               src={movie.poster_url} 
               alt={movie.title}
               className="w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
             />
             <div className="flex-1 pb-4">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 tracking-tight">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium mb-6">
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                     <Clock size={16} className="text-[#00f2fe]" /> {movie.duration_mins} phút
                   </span>
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                     <Calendar size={16} className="text-[#00f2fe]" /> Khởi chiếu: {movie.release_date}
                   </span>
                   <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                     <Star size={16} className="fill-yellow-400" /> {movie.rating} / 10 Điểm
                   </span>
                </div>

                <p className="text-slate-400 leading-relaxed md:w-3/4 text-lg">
                   {movie.description}
                </p>

                <div className="mt-8 flex gap-4">
                   <a 
                      href={movie.trailer_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`} 
                      target="_blank"
                      className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_25px_rgba(0,242,254,0.3)]"
                   >
                      <PlayCircle /> Xem Trailer
                   </a>
                </div>
             </div>
          </div>
       </div>

       {/* Showtimes Section */}
       <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-black text-white">LỊCH CHIẾU & ĐẶT VÉ</h2>
             <div className="w-24 h-1 bg-[#00f2fe] mx-auto mt-4 rounded-full"></div>
          </div>

          {Object.keys(groupedCinemas).length === 0 ? (
             <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <p className="text-xl text-slate-500">Bộ phim này hiện chưa có suất chiếu nào được mở.</p>
             </div>
          ) : (
             <div className="space-y-8">
                {Object.entries(groupedCinemas).map(([cinemaName, times]) => (
                   <div key={cinemaName} className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                        <Building2 className="text-[#00f2fe]" /> {cinemaName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4">
                         {times.map((st: any) => {
                            const date = new Date(st.start_time)
                            const timeString = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            const dateString = date.toLocaleDateString('vi-VN')
                            
                            return (
                               <Link 
                                  href={`/booking/${st.id}`} 
                                  key={st.id}
                                  className="group flex flex-col items-center justify-center min-w-[120px] p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-[#00f2fe] hover:bg-[#00f2fe]/10 transition-all cursor-pointer"
                               >
                                  <span className="text-2xl font-black text-white group-hover:text-[#00f2fe] transition-colors">{timeString}</span>
                                  <span className="text-xs text-slate-400 mt-1">{dateString}</span>
                                  <span className="text-[10px] text-green-400 mt-2 font-mono">{st.rooms?.name}</span>
                               </Link>
                            )
                         })}
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  )
}
