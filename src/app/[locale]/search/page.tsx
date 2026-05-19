import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock, Star, SearchX } from 'lucide-react'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams
  const q = searchParams?.q as string || ''
  
  const supabase = await createClient()

  // Query movies from database
  const { data: movies, error } = await supabase
    .from('movies')
    .select('*')
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 mt-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Kết quả tìm kiếm cho: <span className="text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">"{q}"</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">
          Tìm thấy {movies?.length || 0} kết quả phù hợp trong hệ thống
        </p>
      </div>

      {error ? (
        <div className="text-red-400 bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
          Lỗi lấy dữ liệu từ Database: {error.message}
        </div>
      ) : movies?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-slate-700/50">
          <SearchX size={64} className="text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium text-lg">Rất tiếc, không tìm thấy kết quả nào cho "{q}".</p>
          <p className="text-slate-500 text-sm mt-2">Vui lòng thử lại bằng các từ khoá khác hoặc xem danh sách phim hiện tại.</p>
          <Link href="/" className="mt-6 bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-lg border border-white/10 transition-colors">
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies?.map((movie: any) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all duration-500 flex flex-col shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_15px_40px_rgba(0,242,254,0.15)] hover:-translate-y-2">
                 <div className="aspect-[2/3] w-full overflow-hidden relative bg-black/50">
                    <img 
                      src={movie.poster_url || 'https://via.placeholder.com/300x450'} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                    
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg">
                       <Star size={10} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-[10px] font-black text-white">{movie.rating || 'N/A'}</span>
                    </div>
                 </div>
                 
                 <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-[#0a0f1c]/90 to-transparent backdrop-blur-sm -mt-8 relative z-10">
                    <h3 className="text-slate-100 font-bold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-[#00f2fe] transition-colors drop-shadow-md mb-2">{movie.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-auto text-[10px] font-medium text-slate-400">
                       <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1.5 rounded text-xs border border-white/5">
                          <Calendar size={12} className="text-purple-400" />
                          {movie.release_date || 'N/A'}
                       </div>
                       <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1.5 rounded text-xs border border-white/5">
                          <Clock size={12} className="text-[#00f2fe]" />
                          {movie.duration_mins ? `${movie.duration_mins}p` : 'N/A'}
                       </div>
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      )}
    </div>
  )
}
