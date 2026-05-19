import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { PlayCircle, Ticket, Star, Clock, CalendarDays } from 'lucide-react';
import PromoPopup from '@/components/PromoPopup';
import TrailerModal from '@/components/TrailerModal';

export const revalidate = 0; // Luôn nạp dữ liệu mới nhất từ DB

export default async function Home() {
  const supabase = await createClient();
  
  // Lấy danh sách phim từ Database nội bộ
  const { data: movies, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10); // Lấy 10 phim mới nhất

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <p>Lỗi hệ thống: {error.message}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center p-6">
        <div className="text-center py-20 px-10 bg-slate-900/30 rounded-3xl border border-dashed border-slate-700 backdrop-blur-md">
          <p className="text-slate-400 font-medium text-xl">Rạp phim tạm thời đóng cửa bảo trì.</p>
          <p className="text-slate-600 mt-2">N_thera Admin vui lòng đồng bộ phim từ hệ thống.</p>
        </div>
      </div>
    );
  }

  const heroMovie = movies[0]; // Phim hot nhất ở trên cùng
  const gridMovies = movies;

  return (
    <div className="w-full flex-1 mb-20 animate-in fade-in duration-1000">
      <PromoPopup />
      
      {/* 🎬 HERO SECTION */}
      <section className="relative w-full h-[70vh] min-h-[500px] lg:h-[85vh] flex items-center justify-start overflow-hidden">
        {/* Background Hậu Cảnh (Blur Poster) */}
        <div className="absolute inset-0 z-0">
           <img 
              src={heroMovie.poster_url} 
              className="w-full h-full object-cover opacity-30 scale-105 blur-[10px]" 
              alt="Hậu cảnh chiếu rạp"
           />
           {/* Lớp phủ dải màu chuyển tối dần xuống đen */}
           <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent"></div>
        </div>

        {/* Nội dung Màn Hình Chính */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-10">
           {/* Bên Trái: Thông tin phim */}
           <div className="flex-1 space-y-6 animate-in slide-in-from-bottom duration-700 delay-100">
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-600/80 to-[#00f2fe]/80 border border-[#00f2fe]/50 text-white text-xs font-black tracking-widest rounded-full shadow-[0_0_20px_rgba(0,242,254,0.3)] mb-2 backdrop-blur-sm">
                 ⚡ N_THERA PREMIERES
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] uppercase tracking-tighter text-glow-neon mix-blend-screen drop-shadow-2xl">
                 {heroMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-300">
                 <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
                    <Star size={16} fill="currentColor" /> {Number(heroMovie.rating).toFixed(1)}/10 Điểm
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                 <div className="flex items-center gap-1.5 text-blue-200">
                    <Clock size={16} className="text-[#00f2fe]" /> {heroMovie.duration_mins} Phút
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                 <div className="flex items-center gap-1.5 text-purple-200">
                    <CalendarDays size={16} className="text-purple-400" /> {heroMovie.release_date}
                 </div>
              </div>

              <p className="text-slate-300 md:text-lg leading-relaxed max-w-2xl line-clamp-3 font-medium opacity-90">
                 {heroMovie.description}
              </p>

              <div className="flex gap-4 pt-6">
                 <Link href={`/movie/${heroMovie.id}`} className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] transition-all duration-300 ring-4 ring-[#00f2fe]/20">
                    <Ticket size={20} /> ĐẶT VÉ NGAY
                 </Link>
                 <TrailerModal 
                    trailerUrl={heroMovie.trailer_url} 
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 group"
                 >
                    <PlayCircle size={20} className="group-hover:text-[#00f2fe] transition-colors" /> Xem Trailer
                 </TrailerModal>
              </div>
           </div>

           {/* Bên Phải: Poster Box Cấu Trúc 3D */}
           <div className="hidden md:block w-72 lg:w-96 shrink-0 [perspective:1200px] animate-in zoom-in duration-1000 delay-300">
              <Link href={`/movie/${heroMovie.id}`} className="block relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/10 border-t-white/30 border-l-white/20 transform [transform:rotateY(-15deg)_rotateX(8deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] hover:scale-105 transition-all duration-700 hover:shadow-[0_20px_80px_rgba(0,242,254,0.4)] group">
                 <img src={heroMovie.poster_url} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100" alt="Poster 3D" />
                 {/* Shine effect on hover */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:animate-[shimmer_1.5s_ease-out]"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
              </Link>
           </div>
        </div>
      </section>

      {/* 🎁 ƯU ĐÃI ĐẶC BIỆT (ADS / PROMOS) */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded-3xl overflow-hidden h-48 md:h-56 group cursor-pointer border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-[#00f2fe] opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop" alt="Promo" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit backdrop-blur-md shadow-sm border border-white/20">THÀNH VIÊN MỚI</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase drop-shadow-md tracking-tight leading-none mb-2">Giảm 50%<br/><span className="text-[#00f2fe]">Vé Thứ 2</span></h3>
                <p className="text-slate-100 text-sm font-medium">Áp dụng mọi suất chiếu 2D/3D</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-48 md:h-56 group cursor-pointer border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <img src="https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=1000&auto=format&fit=crop" alt="Popcorn" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit backdrop-blur-md shadow-sm border border-white/20">COMBO BẮP NƯỚC</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase drop-shadow-md tracking-tight leading-none mb-2">Giảm 30%<br/><span className="text-yellow-200">Đồ Ăn</span></h3>
                <p className="text-slate-100 text-sm font-medium">Khi đặt trước qua ứng dụng</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-48 md:h-56 group cursor-pointer border border-white/10 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop" alt="VIP" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full w-fit backdrop-blur-md shadow-sm border border-white/20">ĐẶC QUYỀN VIP</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase drop-shadow-md tracking-tight leading-none mb-2">Đồng Giá<br/><span className="text-pink-200">99k</span></h3>
                <p className="text-slate-100 text-sm font-medium">Trải nghiệm ghế da cao cấp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎞️ NOW SHOWING GRID */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
             <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                <span className="w-2 h-10 bg-gradient-to-b from-[#00f2fe] to-[#4facfe] rounded-full inline-block shadow-[0_0_15px_rgba(0,242,254,0.5)]"></span>
                PHIM ĐANG CHIẾU TẠI RẠP
             </h2>
             <p className="text-slate-400 font-medium mt-2 ml-5">Vũ trụ điện ảnh trong tầm tay. Chạm là mua.</p>
          </div>
          <div className="hidden sm:flex gap-2 items-center bg-slate-900/50 p-2 rounded-full border border-slate-800">
             <div className="w-3 h-3 rounded-full bg-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,1)] animate-ping"></div>
             <span className="text-xs font-bold text-slate-300 uppercase tracking-widest px-2">{gridMovies.length} Phim Online</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {gridMovies.map((movie: any, idx: number) => (
            <Link 
               href={`/movie/${movie.id}`} 
               key={movie.id} 
               className="group relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-[#00f2fe]/50 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(0,242,254,0.25)] flex flex-col h-full animate-in fade-in slide-in-from-bottom"
               style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Poster Image */}
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-black">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                
                {/* ID/Number Tag */}
                <div className="absolute top-0 left-0 bg-gradient-to-br from-[#00f2fe] to-[#4facfe] text-black font-black text-sm px-3 py-1 rounded-br-xl shadow-lg z-10">
                   #{idx + 1}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-[#0f172a]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-md z-10 transition-transform group-hover:scale-110">
                   <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-black text-white">{Number(movie.rating).toFixed(1)}</span>
                </div>
              </div>
              
              {/* Box Nội Dung Text Nổi Lên Trọng Tâm */}
              <div className="p-5 flex-1 flex flex-col justify-end absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent">
                <h3 className="font-bold text-slate-100 text-lg leading-tight mb-2 group-hover:text-[#00f2fe] transition-colors drop-shadow-md">{movie.title}</h3>
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-auto bg-white/5 w-fit px-2 py-1 rounded-md border border-white/5">
                   <Clock size={12} className="text-[#00f2fe]" /> {movie.duration_mins} Phút
                </p>
              </div>

              {/* Lớp Filter Phủ Kính Hover */}
              <div className="absolute inset-0 bg-[var(--background)]/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center z-20">
                 <div className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider text-xs px-6 py-3 rounded-full hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:scale-105 transition-all w-full justify-center">
                      <Ticket size={16}/> ĐẶT VÉ N_THERA
                    </button>
                    <div className="w-12 h-1 bg-[#00f2fe]/30 mx-auto rounded-full mt-6 mb-4"></div>
                    <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed font-medium italic">"{movie.description}"</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎬 TRAILER NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3">
               <span className="w-2 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full inline-block shadow-[0_0_15px_rgba(236,72,153,0.5)]"></span>
               TRAILER ĐÁNG CHÚ Ý
            </h2>
            <p className="text-slate-400 font-medium mt-2 ml-5">Hé lộ những bom tấn sắp tới tại N_thera.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridMovies.slice(0, 3).map((movie: any) => (
             <div key={`trailer-${movie.id}`} className="relative rounded-3xl overflow-hidden aspect-video group border border-slate-800 hover:border-pink-500/50 transition-colors shadow-lg hover:shadow-[0_10px_40px_rgba(236,72,153,0.2)]">
               <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <TrailerModal trailerUrl={movie.trailer_url} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all duration-300 border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <PlayCircle size={32} className="ml-1 opacity-90" />
                  </TrailerModal>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="text-white font-bold text-xl truncate mb-1">{movie.title}</h3>
                  <p className="text-pink-400 text-xs font-bold uppercase tracking-wider">Trailer chính thức</p>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* ✨ TÍNH NĂNG ĐẶC BIỆT / TRẢI NGHIỆM */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 mb-20">
        <div className="mb-10 border-b border-slate-800 pb-6">
          <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3">
             <span className="w-2 h-10 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full inline-block shadow-[0_0_15px_rgba(250,204,21,0.5)]"></span>
             TRẢI NGHIỆM ĐỈNH CAO
          </h2>
          <p className="text-slate-400 font-medium mt-2 ml-5">Nâng tầm cảm xúc điện ảnh với công nghệ tiên tiến nhất.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-900/40 border border-slate-800/80 hover:border-[#00f2fe]/40 rounded-3xl p-8 hover:bg-slate-900/80 transition-all duration-500 group flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left shadow-lg hover:shadow-[0_10px_40px_rgba(0,242,254,0.15)]">
              <div className="w-28 h-28 shrink-0 rounded-3xl bg-gradient-to-br from-blue-600 to-[#00f2fe] flex items-center justify-center text-white transform group-hover:rotate-[10deg] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(0,242,254,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay opacity-50"></div>
                 <div className="text-4xl font-black italic relative z-10">IMAX</div>
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#00f2fe] transition-colors">Công Nghệ IMAX 3D</h3>
                 <p className="text-slate-400 leading-relaxed">Trải nghiệm hình ảnh sắc nét vượt trội với màn hình cong khổng lồ. Hệ thống âm thanh vòm sống động đưa bạn vào thế giới phim một cách chân thực nhất.</p>
              </div>
           </div>

           <div className="bg-slate-900/40 border border-slate-800/80 hover:border-pink-500/40 rounded-3xl p-8 hover:bg-slate-900/80 transition-all duration-500 group flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left shadow-lg hover:shadow-[0_10px_40px_rgba(236,72,153,0.15)]">
              <div className="w-28 h-28 shrink-0 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white transform group-hover:-rotate-[10deg] group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay opacity-50"></div>
                 <div className="text-4xl font-black relative z-10">VIP</div>
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white mb-3 group-hover:text-pink-400 transition-colors">Phòng Chiếu First Class</h3>
                 <p className="text-slate-400 leading-relaxed">Ghế da hạng thương gia cao cấp có thể ngả 180 độ, tích hợp sạc không dây và phục vụ ẩm thực tận ghế. Tận hưởng sự riêng tư và đẳng cấp bậc nhất.</p>
              </div>
           </div>
        </div>
      </section>
      
    </div>
  );
}
