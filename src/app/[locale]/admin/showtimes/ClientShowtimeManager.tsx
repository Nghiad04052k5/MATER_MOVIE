'use client'

import { useRef, useState } from 'react'
import { addCinema, addRoom, addShowtime } from './actions'
import { Building2, DoorOpen, CalendarPlus } from 'lucide-react'

type Cinema = { id: string, name: string }
type Movie = { id: string, title: string }
type Room = { id: string, name: string, cinemas?: { name: string } }

export default function ClientShowtimeManager({ cinemas, movies, rooms }: { cinemas: Cinema[], movies: Movie[], rooms: Room[] }) {
   const [loading, setLoading] = useState(false)

   const handleAction = async (action: (formData: FormData) => Promise<{success: boolean, message?: string}>, formData: FormData, formRef: React.RefObject<HTMLFormElement | null>) => {
      setLoading(true)
      const res = await action(formData)
      setLoading(false)
      if (res.success) {
         alert('Thành công!')
         formRef.current?.reset()
      } else {
         alert('Lỗi: ' + res.message)
      }
   }

   const cinemaFormRef = useRef<HTMLFormElement>(null)
   const roomFormRef = useRef<HTMLFormElement>(null)
   const showtimeFormRef = useRef<HTMLFormElement>(null)

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

         {/* CỘT 1: THÊM RẠP */}
         <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
               <Building2 className="text-[#00f2fe]" /> 1. Thêm Cụm Rạp Mới
            </h2>
            <form ref={cinemaFormRef} action={(fd) => handleAction(addCinema, fd, cinemaFormRef)} className="space-y-4">
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tên rạp</label>
                  <input name="name" required placeholder="VD: N_Thera Vincom Thủ Đức" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]/50 mt-1" />
               </div>
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Địa chỉ</label>
                  <input name="address" required placeholder="Đường Võ Văn Ngân..." className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-[#00f2fe] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]/50 mt-1" />
               </div>
               <button disabled={loading} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all disabled:opacity-50 mt-4">
                  Tạo Rạp Mới
               </button>
            </form>
         </div>

         {/* CỘT 2: THÊM PHÒNG CHIẾU */}
         <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 relative">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
               <DoorOpen className="text-green-400" /> 2. Thêm Phòng Chiếu
            </h2>
            {cinemas.length === 0 ? (
               <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                  <p className="text-sm font-bold text-slate-400">Vui lòng tạo Rạp trước</p>
               </div>
            ) : null}
            <form ref={roomFormRef} action={(fd) => handleAction(addRoom, fd, roomFormRef)} className="space-y-4">
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chọn Cụm Rạp</label>
                  <select name="cinema_id" required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50 mt-1">
                     {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tên Phòng</label>
                  <input name="name" required placeholder="VD: Phòng số 1 - 2D" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50 mt-1" />
               </div>
               <div className="text-xs text-yellow-400 italic">
                  * Kích hoạt tự động sinh 100 ghế ngồi (10x10) với 20 ghế VIP.
               </div>
               <button disabled={loading} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all disabled:opacity-50 mt-4">
                  Sinh Phòng & Mảng Ghế
               </button>
            </form>
         </div>

         {/* CỘT 3: TẠO SUẤT CHIẾU */}
         <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 relative">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
               <CalendarPlus className="text-purple-400" /> 3. Mở Suất Chiếu
            </h2>
            {rooms.length === 0 || movies.length === 0 ? (
               <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl text-center px-4">
                  <p className="text-sm font-bold text-slate-400">Bạn cần Sync Phim và Sinh Phòng chiếu trước</p>
               </div>
            ) : null}
            <form ref={showtimeFormRef} action={(fd) => handleAction(addShowtime, fd, showtimeFormRef)} className="space-y-4">
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chọn Phim</label>
                  <select name="movie_id" required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-400 focus:outline-none mt-1">
                     {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trực thuộc Phòng chiếu</label>
                  <select name="room_id" required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-400 focus:outline-none mt-1">
                     {rooms.map(r => <option key={r.id} value={r.id}>{r.cinemas?.name} - {r.name}</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Thời gian Tương Lai</label>
                     <input name="start_time" type="datetime-local" required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-400 focus:outline-none mt-1 [color-scheme:dark]" />
                  </div>
                  <div>
                     <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Giá vé chuẩn (VNĐ)</label>
                     <input name="base_price" type="number" min="50000" step="10000" defaultValue="70000" required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-400 focus:outline-none mt-1" />
                  </div>
               </div>

               <button disabled={loading} className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  Phát Hành Suất Chiếu
               </button>
            </form>
         </div>

      </div>
   )
}
