'use client'

import { useState } from 'react'
import { syncTMDBMovies, deleteAllMovies } from './actions'
import { Download, Trash2, Film, Star, Clock } from 'lucide-react'

// Render Page Client Component để có thể dùng nút Bấm có trạng thái Loading
export default function AdminMoviesPage({ movies }: { movies?: any[] }) {
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
       await deleteAllMovies()
       setMessage('Đã xóa trắng danh sách phim.')
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

         <div className="flex gap-4">
            <button 
               onClick={handleDelete}
               className="px-6 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold flex items-center gap-2 transition-all"
            >
               <Trash2 size={18} />
               Xoá Hết Phim
            </button>
            <button 
               onClick={handleSync}
               disabled={isSyncing}
               className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all disabled:opacity-50"
            >
               <Download size={18} className={isSyncing ? "animate-bounce" : ""} />
               {isSyncing ? "Đang Đồng Bộ..." : "Sync Phim từ TMDB"}
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
