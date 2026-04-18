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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies?.map((movie) => (
              <div key={movie.id} className="group relative rounded-2xl overflow-hidden bg-slate-800/20 border border-slate-800 hover:border-[#00f2fe]/30 transition-all flex flex-col">
                 <div className="aspect-[2/3] w-full overflow-hidden relative">
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                       <Star size={12} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-xs font-bold text-white">{movie.rating}</span>
                    </div>
                 </div>
                 
                 <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-bold line-clamp-1 group-hover:text-[#00f2fe] transition-colors">{movie.title}</h3>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                       <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {movie.release_date}
                       </div>
                       <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {movie.duration_mins} Phút
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
