'use client'

import { useState } from 'react'
import { syncTMDBMovies, deleteAllMovies } from './actions'
import { Download, Trash2, Film } from 'lucide-react'

// Render Page Client Component để có thể dùng nút Bấm có trạng thái Loading
export default function AdminMoviesPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSync = async () => {
    setIsSyncing(true)
    setMessage('Đang kết nối tải phim từ API...')
    
    const res = await syncTMDBMovies()
    if (res.success) {
      setMessage(`Đồng bộ thành công ${res.count} phim vào Hệ thống rạp!`)
    } else {
      setMessage(`Lỗi: ${res.message}`)
    }
    
    setIsSyncing(false)
  }

  const handleDelete = async () => {
    if(confirm('Bạn có chắc chắn xoá toàn bộ Phim trong Database?')) {
       const res = await deleteAllMovies()
       if (res && res.success === false) {
          setMessage(`Lỗi khi xóa: ${res.message || 'Không rõ nguyên nhân'}`)
       } else {
          setMessage('Đã xóa trắng danh sách phim.')
       }
    }
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <Film className="text-[#00f2fe]" /> Quản Lý Phim
           </h1>
           <p className="text-slate-400 mt-2">Đồng bộ tự động danh sách phim ngoài rạp vào máy chủ nội bộ để làm suất vé.</p>
         </div>

         <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
            <button 
               onClick={handleDelete}
               className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm flex items-center gap-2 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
               <Trash2 size={16} />
               Xoá Hết Phim
            </button>
            <button 
               onClick={handleSync}
               disabled={isSyncing}
               className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
               <Download size={16} className={isSyncing ? "animate-bounce" : ""} />
               {isSyncing ? "ĐANG ĐỒNG BỘ..." : "SYNC PHIM TỪ TMDB"}
            </button>
         </div>
       </div>

       {message && (
          <div className="p-4 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/50 text-[#00f2fe] font-medium text-sm">
             {message}
          </div>
       )}

       {/* Sẽ hiển thị danh sách từ Server truyền sang (Data) ở file gốc */}
    </div>
  )
}
