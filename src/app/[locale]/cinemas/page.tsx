import { createClient } from '@/utils/supabase/server'
import { MapPin, Phone, Mail } from 'lucide-react'

export default async function CinemasPage() {
  const supabase = await createClient()

  // Lấy danh sách rạp
  const { data: cinemas } = await supabase
    .from('cinemas')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-12 text-center">
         <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">HỆ THỐNG RẠP N_THERA</h1>
         <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Khám phá các cụm rạp sang trọng và đầy đủ tiện nghi với công nghệ chiếu phim đẳng cấp nhất.</p>
         <div className="w-24 h-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)]"></div>
      </div>

      {!cinemas || cinemas.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-20 border border-dashed border-slate-700 bg-slate-900/40 rounded-3xl">
           <MapPin size={48} className="text-slate-600 mb-4" />
           <p className="text-xl text-slate-500">Hệ thống đang mở rộng. Vui lòng quay lại sau.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
            {cinemas.map((cinema: any, index: number) => {
               // Danh sách 3 ảnh rạp tuyệt đẹp (Sử dụng index để đổi ảnh)
               const cinemaImages = [
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop", // Rạp cổ điển/sang trọng
                  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop", // Khán giả
                  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop"  // Đèn Neon
               ];
               const bgImg = cinemaImages[index % cinemaImages.length];

               return (
                  <div key={cinema.id} className="group relative rounded-[2rem] bg-slate-900/40 border border-slate-800/80 backdrop-blur-md overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,242,254,0.15)] flex flex-col">
                     
                     {/* Hình ảnh Rạp */}
                     <div className="relative h-64 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
                        <img src={bgImg} alt={cinema.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                        
                        {/* Huy hiệu Premium */}
                        <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></div>
                           <span className="text-[10px] font-black text-white tracking-widest uppercase">Premium</span>
                        </div>
                     </div>
                     
                     {/* Nội dung thông tin */}
                     <div className="p-8 flex-1 flex flex-col relative z-20 -mt-12 bg-gradient-to-b from-transparent to-slate-900/80">
                        <h2 className="text-3xl font-black text-white mb-6 group-hover:text-[#00f2fe] transition-colors drop-shadow-lg">{cinema.name}</h2>
                        
                        <div className="space-y-4 mb-8 flex-1">
                           <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-[#00f2fe]/10 flex items-center justify-center shrink-0 border border-[#00f2fe]/20">
                                 <MapPin className="text-[#00f2fe]" size={18} />
                              </div>
                              <div className="flex flex-col justify-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ</span>
                                 <span className="text-slate-200 text-sm leading-relaxed">{cinema.address}</span>
                              </div>
                           </div>

                           <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                                 <Phone className="text-purple-400" size={18} />
                              </div>
                              <div className="flex flex-col justify-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hotline</span>
                                 <span className="text-slate-200 text-sm font-mono">+84 1900 1234</span>
                              </div>
                           </div>

                           <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                 <Mail className="text-emerald-400" size={18} />
                              </div>
                              <div className="flex flex-col justify-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</span>
                                 <span className="text-slate-200 text-sm font-mono">support@nthera.vn</span>
                              </div>
                           </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-6 border-t border-slate-800/80 flex gap-4">
                           <button className="flex-1 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white font-bold text-sm transition-all shadow-inner">Xem Bản Đồ</button>
                           <button className="flex-1 py-3.5 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider text-sm rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] group-hover:scale-[1.02]">Mua Vé</button>
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
