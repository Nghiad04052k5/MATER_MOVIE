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
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cinemas.map((cinema: any) => (
               <div key={cinema.id} className="group relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-[#00f2fe]/50 transition-all hover:shadow-[0_0_30px_rgba(0,242,254,0.15)] flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 h-48 md:h-full relative overflow-hidden shrink-0 bg-slate-800">
                     {/* Placeholder image cho ảnh rạp */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#00f2fe]/20 to-purple-500/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity"></div>
                     <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop" alt={cinema.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0" />
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-center">
                     <h2 className="text-2xl font-black text-white mb-4 group-hover:text-[#00f2fe] transition-colors">{cinema.name}</h2>
                     <div className="space-y-4">
                        <div className="flex items-start gap-3">
                           <MapPin className="text-slate-400 shrink-0 mt-1" size={18} />
                           <span className="text-slate-300 text-sm leading-relaxed">{cinema.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Phone className="text-slate-400 shrink-0" size={18} />
                           <span className="text-slate-300 text-sm font-mono">+84 1900 1234</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Mail className="text-slate-400 shrink-0" size={18} />
                           <span className="text-slate-300 text-sm font-mono">support@nthera.vn</span>
                        </div>
                     </div>
                     <div className="mt-8 pt-6 border-t border-slate-800/50 flex gap-4">
                        <button className="px-5 py-2.5 rounded-full border border-slate-700 hover:bg-white hover:text-black font-bold text-sm transition-all">Xem Bản Đồ</button>
                        <button className="px-5 py-2.5 bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 hover:bg-[#00f2fe] hover:text-black font-bold text-sm rounded-full transition-all">Mua Vé Tại Đây</button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  )
}
