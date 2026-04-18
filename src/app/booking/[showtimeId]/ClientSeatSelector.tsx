'use client'

import { useState } from 'react'
import { bookSeats } from './actions'
import { useRouter } from 'next/navigation'
import { Monitor, Armchair, CheckCircle2, QrCode } from 'lucide-react'

export default function ClientSeatSelector({ showtime, seats, bookedSeatIds }: { showtime: any, seats: any[], bookedSeatIds: string[] }) {
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentMode, setPaymentMode] = useState(false)
  const [successMode, setSuccessMode] = useState(false)

  // Gom nhóm ghế thành từng hàng cho dễ render grid
  const rowMap: Record<string, any[]> = {}
  seats.forEach(s => {
     if (!rowMap[s.seat_row]) rowMap[s.seat_row] = []
     rowMap[s.seat_row].push(s)
  })
  // Sort các hàng từ A -> Z
  const sortedRows = Object.keys(rowMap).sort()

  const handleToggleSeat = (seat: any) => {
    // Nếu ghế đã bị bán thì không phản hồi
    if (bookedSeatIds.includes(seat.id)) return

    const index = selectedSeats.findIndex(s => s.id === seat.id)
    if (index > -1) {
       setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
       // Giới hạn chỉ được mua tối đa 6 ghế 1 lần
       if (selectedSeats.length >= 6) {
          alert("Bạn chỉ được chọn tối đa 6 ghế trong một giao dịch.")
          return
       }
       setSelectedSeats([...selectedSeats, seat])
    }
  }

  // Tính tiền
  const totalAmount = selectedSeats.reduce((acc, seat) => {
     const surcharge = seat.seat_type === 'VIP' ? 20000 : 0
     return acc + showtime.base_price + surcharge
  }, 0)

  const handleCheckout = async () => {
    setLoading(true)

    const formData = new FormData()
    formData.append('showtime_id', showtime.id)
    formData.append('total_amount', totalAmount.toString())
    formData.append('seat_ids', JSON.stringify(selectedSeats.map(s => s.id)))

    const res = await bookSeats(formData)
    setLoading(false)

    if (res.success) {
       setPaymentMode(false)
       setSuccessMode(true)
    } else {
       alert(res.message)
       if (res.message.includes('tíc tắc')) {
          setPaymentMode(false)
          router.refresh() // Reset lại để lấy trạng thái grid mới nhất
          setSelectedSeats([])
       }
    }
  }

  if (successMode) {
     return (
       <div className="flex flex-col flex-1 items-center justify-center p-12 bg-slate-900/50 rounded-3xl border border-green-500/30 backdrop-blur-md animate-in zoom-in-95 duration-500">
         <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={48} className="text-green-400" />
         </div>
         <h2 className="text-3xl font-black text-white mb-2 tracking-wide">THANH TOÁN THÀNH CÔNG</h2>
         <p className="text-slate-400 mb-8 max-w-md text-center">Chúc mừng bạn đã sở hữu {selectedSeats.length} vé cho phim <strong>{showtime.movies?.title}</strong>. Tận hưởng bộ phim nhé!</p>
         
         <div className="flex gap-4">
            <button onClick={() => router.push('/')} className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold transition-all">
               Về Trang Chủ
            </button>
         </div>
       </div>
     )
  }

  if (paymentMode) {
     // Render Cổng thanh toán mã QR Động VietQR
     const seatNames = selectedSeats.map(s => `${s.seat_row}${s.seat_col}`).join(', ')
     const transferContent = `N THERA VE ${seatNames}`
     // Sử dụng VietQR API: nganhang-stk-template.png?amount=x&addInfo=y&accountName=z
     const qrUrl = `https://img.vietqr.io/image/970418-5811852874-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=DAO MINH NGHIA`

     return (
        <div className="flex flex-col md:flex-row gap-8 items-stretch animate-in fade-in duration-500">
           <div className="flex-1 bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col items-center text-center">
              <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-2"><QrCode className="text-[#00f2fe]" /> Quét Mã Thanh Toán</h2>
              <p className="text-slate-400 text-sm mb-8">Sử dụng App Ngân hàng bất kỳ để quét mã. Số tiền sẽ tự động được nhập.</p>

              <div className="bg-white p-4 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] mb-6">
                 <img src={qrUrl} alt="QR Code Payment" className="w-64 h-64 object-contain rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md text-left bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                 <div><p className="text-xs text-slate-500">Ngân hàng</p><p className="font-bold text-white">BIDV</p></div>
                 <div><p className="text-xs text-slate-500">Chủ tài khoản</p><p className="font-bold text-white">DAO MINH NGHIA</p></div>
                 <div><p className="text-xs text-slate-500">Số tài khoản</p><p className="font-bold tracking-widest text-[#00f2fe]">5811852874</p></div>
                 <div><p className="text-xs text-slate-500">Nội dung</p><p className="font-bold text-slate-300 uppercase">{transferContent}</p></div>
              </div>
           </div>

           <div className="w-full lg:w-[350px] bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col justify-between">
              <div>
                 <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Hóa Đơn Của Bạn</h3>
                 <div className="space-y-3 mb-6">
                     <div className="flex justify-between text-slate-300"><span>Phim:</span> <span className="font-bold text-white text-right">{showtime.movies?.title}</span></div>
                     <div className="flex justify-between text-slate-300"><span>Vị trí ghế:</span> <span className="font-bold text-[#00f2fe]">{seatNames}</span></div>
                 </div>
              </div>

              <div className="mt-auto border-t border-slate-800 pt-6">
                 <div className="flex justify-between items-baseline mb-6">
                    <span className="text-slate-400 text-sm font-medium">Cần thanh toán:</span>
                    <span className="text-3xl font-mono text-[#00f2fe] font-black">{totalAmount.toLocaleString()}<span className="text-sm">đ</span></span>
                 </div>
                 
                 <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-slate-950 font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] flex items-center justify-center gap-2"
                 >
                    {loading ? 'Đang xác nhận...' : <><CheckCircle2 size={20} /> Tôi Đã Chuyển Khoản</>}
                 </button>
                 <button 
                    onClick={() => setPaymentMode(false)}
                    disabled={loading}
                    className="w-full mt-3 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-bold"
                 >
                    Hủy bỏ
                 </button>
              </div>
           </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
       {/* BẢN ĐỒ MÀN HÌNH CHỌN GHẾ TƯƠNG TÁC */}
       <div className="flex-1 w-full bg-slate-900/50 p-6 md:p-12 rounded-3xl border border-slate-800 backdrop-blur-sm overflow-x-auto overflow-y-hidden shadow-2xl">
          {/* Màn chiếu giả lập Cong */}
          <div className="w-full flex flex-col items-center mb-16 relative">
             <div className="absolute top-0 w-full h-[100px] border-t-4 border-[#00f2fe] rounded-[50%] blur-[2px] opacity-20"></div>
             <div className="w-4/5 h-[80px] border-t-2 border-[#00f2fe] rounded-[50%] [box-shadow:0_-15px_30px_rgba(0,242,254,0.3)] flex justify-center items-end pb-2 transform perspective-[800px] rotateX-[-10deg]">
                <span className="text-[#00f2fe] font-black tracking-[0.5em] text-sm md:text-base opacity-50 flex items-center gap-2">
                   <Monitor size={16} /> SCREEN
                </span>
             </div>
          </div>

          <div className="min-w-[600px] flex flex-col gap-3 md:gap-4 items-center">
             {sortedRows.map(rowLabel => (
               <div key={rowLabel} className="flex gap-2 items-center w-full justify-center">
                  <div className="w-6 md:w-8 font-black text-slate-500 text-center text-sm md:text-lg">{rowLabel}</div>
                  
                  {/* Sort cột từ 1 đến 10 */}
                  {rowMap[rowLabel].sort((a,b) => a.seat_col - b.seat_col).map(seat => {
                     const isTaken = bookedSeatIds.includes(seat.id)
                     const isSelected = selectedSeats.some(s => s.id === seat.id)
                     const isVIP = seat.seat_type === 'VIP'

                     let btnColor = "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-[#00f2fe]/50 hover:bg-[#00f2fe]/10"
                     if (isVIP) btnColor = "bg-purple-900/40 border-purple-800/50 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20"
                     
                     if (isTaken) btnColor = "bg-slate-950 border-slate-800/20 text-slate-700 cursor-not-allowed opacity-50 relative overflow-hidden"
                     if (isSelected) btnColor = "bg-gradient-to-t from-[#00f2fe] to-[#4facfe] border-transparent text-black"

                     return (
                        <button 
                          key={seat.id} 
                          onClick={() => handleToggleSeat(seat)}
                          disabled={isTaken}
                          className={`
                            relative w-9 h-9 md:w-11 md:h-11 rounded-t-lg md:rounded-t-xl rounded-b-md flex items-center justify-center border font-bold text-xs md:text-sm transition-all duration-200 shadow-sm
                            ${btnColor}
                            ${isSelected ? 'scale-110 shadow-[0_5px_15px_rgba(0,242,254,0.4)] z-10' : ''}
                          `}
                          title={`Ghế ${seat.seat_row}${seat.seat_col} - ${seat.seat_type}`}
                        >
                           {/* Dấu X cho ghế đã bán */}
                           {isTaken && <div className="absolute inset-0 flex items-center justify-center opacity-30"><span className="text-xl rotate-45">+</span></div>}
                           
                           {/* Icon ghế chỉ viền ở dưới để tạo hình cái tựa */}
                           <div className={`absolute bottom-0 w-3/4 h-1/5 rounded-t-sm opacity-20 ${isSelected ? 'bg-black' : 'bg-white'}`}></div>
                           
                           <span className="relative z-10 font-mono">{seat.seat_col}</span>
                        </button>
                     )
                  })}
                  
                  <div className="w-6 md:w-8 font-black text-slate-500 text-center text-sm md:text-lg">{rowLabel}</div>
               </div>
             ))}
          </div>

          <div className="flex justify-center items-center mt-12 gap-6 md:gap-10 border-t border-slate-800 pt-8">
             <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-slate-800 border border-slate-700"></div><span className="text-xs text-slate-400">Thường</span></div>
             <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-purple-900/40 border border-purple-800"></div><span className="text-xs text-slate-400">Tùy Chọn VIP (+20k)</span></div>
             <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gradient-to-t from-[#00f2fe] to-[#4facfe]"></div><span className="text-xs text-slate-400 text-[#00f2fe] font-bold">Đang Chọn</span></div>
             <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-slate-950 border border-slate-900 flex items-center justify-center"><span className="text-slate-600 rotate-45">+</span></div><span className="text-xs text-slate-600">Đã bán</span></div>
          </div>
       </div>

       {/* THANH TOÁN (CART) BÊN PHẢI */}
       <div className="w-full lg:w-[350px] bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col sticky top-24">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Hóa Đơn / Cart</h3>
          
          <div className="flex-1 space-y-4">
             {selectedSeats.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                   <Armchair size={24} className="mb-2 opacity-50" />
                   <p className="text-sm">Vui lòng chọn ghế.</p>
                </div>
             ) : (
                <div className="space-y-3">
                   {selectedSeats.map(s => {
                      const surcharge = s.seat_type === 'VIP' ? 20000 : 0
                      const itemPrice = showtime.base_price + surcharge
                      return (
                        <div key={s.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                           <div>
                              <span className="font-bold text-white tracking-widest">{s.seat_row}{s.seat_col}</span>
                              <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{s.seat_type}</span>
                           </div>
                           <span className="font-mono text-sm text-green-400">{itemPrice.toLocaleString()}đ</span>
                        </div>
                      )
                   })}
                </div>
             )}
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
             <div className="flex justify-between items-baseline mb-6">
                <span className="text-slate-400 text-sm font-medium">Tổng thanh toán:</span>
                <span className="text-3xl font-mono text-[#00f2fe] font-black">{totalAmount.toLocaleString()}<span className="text-sm">đ</span></span>
             </div>
             
             <button 
                onClick={() => setPaymentMode(true)}
                disabled={selectedSeats.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-slate-950 font-black uppercase tracking-widest transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)]"
             >
                TIẾN HÀNH THANH TOÁN
             </button>
          </div>
       </div>

    </div>
  )
}

