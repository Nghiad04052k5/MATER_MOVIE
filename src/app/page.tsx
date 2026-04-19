import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export const revalidate = 0; // Luôn nạp dữ liệu mới nhất từ DB (hoặc dùng ISR tuỳ ý)

export default async function Home() {
  const supabase = await createClient();
  
  // Lấy danh sách phim từ Database nội bộ
  const { data: movies, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10); // Lấy 10 phim mới nhất

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-black mb-4 flex items-center gap-3">
          <span className="w-2 h-8 bg-[#00f2fe] rounded-full inline-block"></span>
          PHIM ĐANG CHIẾU
        </h2>
        <p className="text-slate-400">Danh sách các siêu phẩm điện ảnh cập nhật trực tiếp tại rạp.</p>
      </div>

      {error ? (
        <div className="text-center py-20 text-red-500">
          <p>Lỗi truy xuất dữ liệu: {error.message}</p>
        </div>
      ) : !movies || movies.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <p className="text-slate-500 font-medium text-lg">Hiện tại rạp chưa có lịch chiếu phim nào.</p>
          <p className="text-slate-600 text-sm mt-1">Admin vui lòng đăng nhập để đồng bộ phim.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie: { id: string, title: string, poster_url: string, rating: string, release_date: string, description: string }) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="group relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-[#00f2fe]/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(0,242,254,0.15)] flex flex-col h-full">
              {/* Poster Container with Aspect Ratio */}
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-80" />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-bold text-white">{Number(movie.rating).toFixed(1)}</span>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-4 flex-1 flex flex-col justify-end absolute bottom-0 left-0 right-0">
                <h3 className="font-bold text-slate-100 line-clamp-2 leading-tight mb-1 group-hover:text-[#00f2fe] transition-colors">{movie.title}</h3>
                <p className="text-xs text-slate-400 mt-auto">{movie.release_date || 'Đang cập nhật'}</p>
              </div>

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                 <div>
                    <button className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all pointer-events-none">
                      Xem Suất Chiếu
                    </button>
                    <p className="text-xs text-slate-300 mt-4 line-clamp-3 leading-relaxed">{movie.description}</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
