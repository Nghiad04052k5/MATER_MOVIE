import { Ticket, Gift, CreditCard, Sparkles } from 'lucide-react'

export default function OffersPage() {
  const offers = [
    {
      id: 1,
      title: 'HSSV ĐỒNG GIÁ 49K',
      description: 'Áp dụng cho Học sinh Sinh viên mang theo Thẻ HSSV. Xem phim thỏa thích chỉ với 49,000 VNĐ suốt tuần.',
      icon: <Ticket className="text-[#00f2fe]" size={32} />,
      color: 'from-[#00f2fe] to-[#4facfe]'
    },
    {
      id: 2,
      title: 'TÍCH ĐIỂM HOÀN 10%',
      description: 'Trở thành thành viên N_THERA VIP. Nhận hoàn tiền 10% cho mọi chi tiêu bằng thẻ ảo trên hệ thống.',
      icon: <Sparkles className="text-purple-400" size={32} />,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 3,
      title: 'THANH TOÁN QR NHẬN BẮP NƯỚC',
      description: 'Quét mã VietQR thanh toán tự động, nhận ngay 1 Combo Bắp+Nước miễn phí cho hóa đơn trên 200k.',
      icon: <CreditCard className="text-green-400" size={32} />,
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 4,
      title: 'XEM PHIM SINH NHẬT MIỄN PHÍ',
      description: 'Đến đúng ngày sinh nhật của bạn, tặng ngay 1 vé 2D và 1 bắp ngọt. Bạn cứ việc đến, N_Thera bao trọn!',
      icon: <Gift className="text-rose-400" size={32} />,
      color: 'from-rose-400 to-pink-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-16 text-center">
         <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ƯU ĐÃI & SỰ KIỆN</h1>
         <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Đừng bỏ lỡ các chương trình khuyến mãi và quyền lợi siêu hấp dẫn cực chất dành riêng cho thành viên của Hệ thống rạp phim thông minh N_Thera.</p>
         <div className="w-24 h-1 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map(offer => (
           <div key={offer.id} className="group relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-8 hover:border-white/50 transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${offer.color}`}></div>
              
              <div className={`w-16 h-16 rounded-2xl bg-slate-800/80 mb-6 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform`}>
                 {offer.icon}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-4 line-clamp-2">{offer.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{offer.description}</p>
              
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                 <button className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#00f2fe] transition-colors flex items-center gap-2">
                    Chi tiết <span className="text-lg leading-none">&rarr;</span>
                 </button>
              </div>
           </div>
        ))}
      </div>
      
      <div className="mt-16 w-full h-[300px] rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-800">
         <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop" alt="Banner Offer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 blur-[2px] group-hover:blur-0" />
         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
         <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 max-w-md">
            <span className="px-3 py-1 bg-red-600 font-bold text-white text-xs uppercase tracking-widest rounded mb-4 inline-block">Flash Sale Cuối Tuần</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">MUA 1 TẶNG 1 ĐẠI TIỆC PHIM TẾT</h2>
            <p className="text-slate-300 font-medium max-w-xs mb-8">Trải nghiệm màn chiếu IMAX và âm thanh vòm Dolby Atmos với giá chỉ bằng một nửa.</p>
            <button className="px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-wider hover:bg-[#00f2fe] transition-colors shadow-lg">Lấy Mã Ngay</button>
         </div>
      </div>
    </div>
  )
}
