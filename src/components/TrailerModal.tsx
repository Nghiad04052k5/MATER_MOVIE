'use client'

import { useState } from 'react'
import { PlayCircle, X } from 'lucide-react'

export default function TrailerModal({ trailerUrl }: { trailerUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  // Chuyển đổi link youtube thông thường sang dạng embed nếu cần
  const getEmbedUrl = (url?: string) => {
    if (!url) return ''
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/')
    }
    return url
  }

  const embedUrl = getEmbedUrl(trailerUrl)

  const handleOpen = () => {
    if (!embedUrl) {
      alert('Phim này đang được cập nhật Trailer gốc, vui lòng quay lại sau!')
      return
    }
    setIsOpen(true)
  }

  return (
    <>
      <button 
        onClick={handleOpen}
        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_25px_rgba(0,242,254,0.3)]"
      >
        <PlayCircle /> Xem Trailer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Lớp nền mờ */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Khung video */}
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 z-10 animate-in fade-in zoom-in duration-300">
             <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                title="Đóng"
             >
                <X size={24} />
             </button>
             
             <iframe 
                src={`${embedUrl}?autoplay=1`} 
                title="Movie Trailer" 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
             ></iframe>
          </div>
        </div>
      )}
    </>
  )
}
