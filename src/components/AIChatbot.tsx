'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Maximize2, Minimize2, Trash2, Clock, ChevronLeft } from 'lucide-react'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  
  const defaultMessages = [
     { role: 'assistant' as const, content: 'Xin chào! Tôi là N_thera AI. Tôi có thể giúp bạn tra cứu thông tin rạp chiếu, lịch phim hoặc giải đáp các thắc mắc. Bạn cần tôi giúp gì?' }
  ]
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>(defaultMessages)
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Tải lịch sử chat
  useEffect(() => {
     const saved = localStorage.getItem('nthera_chat_history')
     if (saved) {
        try {
           setMessages(JSON.parse(saved))
        } catch(e) {}
     }
  }, [])

  // Cuộn & Lưu lịch sử chat
  useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
     if (messages.length > 1) {
        localStorage.setItem('nthera_chat_history', JSON.stringify(messages))
     }
  }, [messages, isOpen])

  const clearHistory = () => {
     setMessages(defaultMessages)
     localStorage.removeItem('nthera_chat_history')
  }

  const handleDeleteQuestion = (content: string) => {
     setMessages(prev => {
        const idx = prev.findIndex(m => m.role === 'user' && m.content === content)
        if (idx !== -1) {
           const newMsgs = [...prev]
           newMsgs.splice(idx, 1) // Xóa câu hỏi user
           // Nếu câu tiếp theo là câu trả lời của bot thì xóa luôn
           if (newMsgs[idx] && newMsgs[idx].role === 'assistant') {
              newMsgs.splice(idx, 1)
           }
           // Cập nhật localStorage ngay
           localStorage.setItem('nthera_chat_history', JSON.stringify(newMsgs))
           return newMsgs
        }
        return prev
     })
  }

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
     if (e) e.preventDefault()
     const payloadText = textOverride || input
     if (!payloadText.trim()) return

     const userMsg = payloadText
     setInput('')
     setMessages(prev => [...prev, { role: 'user', content: userMsg }])
     setIsLoading(true)

     try {
        const response = await fetch('/api/chat', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: userMsg })
        })
        const data = await response.json()

        if (data.reply) {
           setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        }
     } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi đang gặp lỗi kết nối. Vui lòng thử lại sau.' }])
     } finally {
        setIsLoading(false)
     }
  }

  return (
    <>
       {/* Floating Button */}
       <button 
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] rounded-full flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
       >
          <MessageSquare size={24} />
       </button>

       {/* Chat Window */}
       <div className={`fixed bottom-8 right-8 ${isMaximized ? 'w-[500px] h-[700px]' : 'w-[350px] h-[500px]'} bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'} max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 rounded-t-2xl">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center shadow-inner">
                   <span className="font-black text-xs text-slate-950">N_</span>
                </div>
                <div>
                   <h3 className="font-bold text-white text-sm">N_thera AI</h3>
                   <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-slate-400">Trực tuyến</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={() => setShowHistory(!showHistory)} className={`text-slate-400 hover:text-white transition-colors ${showHistory ? 'text-[#00f2fe]' : ''}`} title={showHistory ? "Quay lại Chat" : "Xem lịch sử câu hỏi"}>
                   {showHistory ? <MessageSquare size={18} /> : <Clock size={18} />}
                </button>
                {!showHistory && (
                   <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 transition-colors" title="Xóa toàn bộ chat">
                      <Trash2 size={16} />
                   </button>
                )}
                <button onClick={() => setIsMaximized(!isMaximized)} className="text-slate-400 hover:text-white transition-colors" title={isMaximized ? "Thu nhỏ" : "Phóng to"}>
                   {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                   <X size={20} />
                </button>
             </div>
          </div>

          {/* Body Content */}
          {showHistory ? (
             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50 rounded-b-2xl">
                <div className="flex items-center gap-2 text-slate-400 mb-4 pb-2 border-b border-slate-800">
                   <Clock size={16} />
                   <span className="text-sm font-bold">Các câu hỏi đã hỏi</span>
                </div>
                {messages.filter(m => m.role === 'user').length === 0 ? (
                   <div className="text-center text-slate-500 text-sm mt-10">Bạn chưa hỏi câu nào.</div>
                ) : (
                   messages.map((msg, originalIndex) => {
                      if (msg.role !== 'user') return null;
                      return (
                         <div key={originalIndex} className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-xl flex items-start justify-between gap-3 hover:bg-slate-700/80 transition-colors shadow-sm">
                            <p className="text-slate-300 text-sm flex-1 leading-relaxed">{msg.content}</p>
                            <button 
                               onClick={() => handleDeleteQuestion(msg.content)}
                               className="text-slate-500 hover:text-red-400 bg-slate-900/50 hover:bg-slate-900 p-2 rounded-lg transition-all"
                               title="Xóa câu hỏi này"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                      )
                   })
                )}
             </div>
          ) : (
             <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] rounded-2xl p-3 text-sm flex gap-2 ${msg.role === 'user' ? 'bg-[#00f2fe]/20 text-[#00f2fe] rounded-tr-sm border border-[#00f2fe]/30' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                            {msg.role === 'assistant' && <Bot size={14} className="mt-0.5 shrink-0 opacity-70" />}
                            <span className="leading-relaxed whitespace-pre-wrap">{msg.content}</span>
                         </div>
                      </div>
                   ))}
                   {isLoading && (
                      <div className="flex justify-start">
                         <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700 p-4">
                            <div className="flex gap-1">
                               <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                               <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                               <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                         </div>
                      </div>
                   )}
                   <div ref={messagesEndRef} />
                </div>

                {/* Hộp gợi ý */}
                <div className="px-3 pb-2 flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                   <button onClick={() => handleSend(undefined, "Có phim gì mới đang chiếu?")} className="px-3 py-1.5 text-[11px] bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-[#00f2fe] hover:border-[#00f2fe]/50 transition-colors shrink-0">🎬 Phim mới</button>
                   <button onClick={() => handleSend(undefined, "Lịch chiếu hôm nay thế nào?")} className="px-3 py-1.5 text-[11px] bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-[#00f2fe] hover:border-[#00f2fe]/50 transition-colors shrink-0">📅 Lịch chiếu</button>
                   <button onClick={() => handleSend(undefined, "Giá vé là bao nhiêu?")} className="px-3 py-1.5 text-[11px] bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-[#00f2fe] hover:border-[#00f2fe]/50 transition-colors shrink-0">🎟️ Giá vé</button>
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-2xl flex gap-2">
                   <input 
                      type="text" 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Hỏi N_thera AI..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 text-sm text-white focus:outline-none focus:border-[#00f2fe]/50 placeholder-slate-600 transition-all"
                   />
                   <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] text-slate-950 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all shrink-0"
                   >
                      <Send size={16} className="-ml-0.5" />
                   </button>
                </form>
             </>
          )}
       </div>
    </>
  )
}
