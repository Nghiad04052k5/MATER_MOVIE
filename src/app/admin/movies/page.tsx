import { createClient } from '@/utils/supabase/server'
import ClientPage from './ClientPage'
import { Calendar, Clock, Star } from 'lucide-react'

// Cập nhật cách lấy params bất đồng bộ cho Next.js 15+
// Nhưng page này không có params, ta khai báo chuẩn
export default async function MoviesServerPage() {
  const supabase = await createClient()

  // Fetch phim từ bảng movies trong database của chúng ta
  const { data: movies, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <ClientPage />

      {/* Grid hiển thị phim nội bộ */}
      {error ? (
         <div className="text-red-400">Lỗi lấy dữ liệu từ DataBase: {error.message}</div>
      ) : movies?.length === 0 ? (
         <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
            <p className="text-slate-500 font-medium text-lg">Chưa có phim nào trong hệ thống nội bộ của rạp.</p>
            <p className="text-slate-600 text-sm mt-1">Bấm nút "Sync Phim từ TMDB" ở trên để tự động kéo phim đang chiếu về máy chủ.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies?.map((movie: any) => (
              <div key={movie.id} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all duration-500 flex flex-col shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_15px_40px_rgba(0,242,254,0.15)] hover:-translate-y-2">
                 <div className="aspect-[2/3] w-full overflow-hidden relative bg-black/50">
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                    
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-lg">
                       <Star size={12} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-xs font-black text-white">{movie.rating}</span>
                    </div>
                 </div>
                 
                 <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-[#0a0f1c]/80 to-transparent backdrop-blur-sm -mt-10 relative z-10">
                    <h3 className="text-slate-100 font-bold text-lg leading-tight line-clamp-1 group-hover:text-[#00f2fe] transition-colors drop-shadow-md mb-3">{movie.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-auto text-xs font-medium text-slate-400">
                       <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          <Calendar size={12} className="text-purple-400" />
                          {movie.release_date}
                       </div>
                       <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                          <Clock size={12} className="text-[#00f2fe]" />
                          {movie.duration_mins}p
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      )}
    </div>
  )
}
