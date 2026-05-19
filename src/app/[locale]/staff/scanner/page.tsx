'use client'

import { useState } from 'react'
import { scanTicket } from './actions'
import { QrCode, ScanLine, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ScannerPage() {
  const [ticketId, setTicketId] = useState('')
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: { id: string; showtime_id: string } } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketId) return

    setLoading(true)
    const res = await scanTicket(ticketId)
    setResult(res)
    setLoading(false)
    setTicketId('') // Clear after scan
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
       <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-md">
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                 <ScanLine size={40} className="text-purple-400 animate-pulse" />
             </div>
          </div>
          
          <h1 className="text-2xl font-black text-center text-white mb-2">QUÉT VÉ VÀO RẠP</h1>
          <p className="text-center text-slate-400 text-sm mb-8">Role: Nhập Mã vé / Ticket ID để check-in cho khách hàng</p>

          <form onSubmit={handleScan} className="flex flex-col gap-4 mb-8">
             <div className="relative">
                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                   type="text" 
                   value={ticketId}
                   onChange={(e) => setTicketId(e.target.value)}
                   placeholder="Nhập mã Ticket ID (UUID)..." 
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-sm focus:border-purple-500 focus:outline-none transition-all shadow-inner"
                />
             </div>
             <button 
                type="submit" 
                disabled={loading || !ticketId}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 py-4 rounded-xl text-white font-black uppercase tracking-widest disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
             >
                {loading ? 'ĐANG KIỂM TRA...' : 'XÁC NHẬN SOÁT VÉ'}
             </button>
          </form>

          {/* Kết quả trả về */}
          {result && (
             <div className={`p-6 rounded-2xl border ${result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} transition-all animate-in zoom-in-95`}>
                <div className="flex items-center gap-3 mb-2">
                   {result.success ? <CheckCircle2 className="text-green-400" /> : <AlertCircle className="text-red-400" />}
                   <h3 className={`font-bold text-lg ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                      {result.success ? 'HỢP LỆ!' : 'TỪ CHỐI!'}
                   </h3>
                </div>
                <p className="text-slate-300 text-sm">{result.message}</p>
                {result.ticket && (
                   <div className="mt-4 p-3 bg-slate-950/50 rounded-lg text-xs font-mono text-slate-400 border border-slate-800">
                      ID: {result.ticket.id}<br/>
                      Showtime: {result.ticket.showtime_id}
                   </div>
                )}
             </div>
          )}
       </div>
    </div>
  )
}
