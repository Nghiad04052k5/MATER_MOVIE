'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
     { role: 'assistant', content: 'Xin chào! Tôi là N_thera AI. Tôi có thể giúp bạn tra cứu thông tin rạp chiếu, lịch phim hoặc giải đáp các thắc mắc. Bạn cần tôi giúp gì?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!input.trim()) return

     const userMsg = input
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
       <div className={`fixed bottom-8 right-8 w-[350px] h-[500px] bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
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
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] rounded-2xl p-3 text-sm flex gap-2 ${msg.role === 'user' ? 'bg-[#00f2fe]/20 text-[#00f2fe] rounded-tr-sm border border-[#00f2fe]/30' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                      {msg.role === 'assistant' && <Bot size={14} className="mt-0.5 shrink-0 opacity-70" />}
                      <span className="leading-relaxed">{msg.content}</span>
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
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] text-slate-950 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
             >
                <Send size={16} className="-ml-0.5" />
             </button>
          </form>
       </div>
    </>
  )
}
