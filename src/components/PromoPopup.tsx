'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Ticket, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

const ads = [
  {
    id: 1,
    title: "Siêu Ưu Đãi",
    badge: "Thành Viên Mới",
    discount: "Giảm 50%",
    subtitle: "vé thứ 2",
    desc: "Áp dụng mọi suất chiếu tại N_thera. Nhanh tay đặt vé ngay hôm nay để tận hưởng ưu đãi!",
    icon: Gift,
    bgFrom: "from-purple-600",
    bgTo: "to-[#00f2fe]",
    textColor: "text-[#00f2fe]",
  },
  {
    id: 2,
    title: "Combo Bắp Nước",
    badge: "Mua Online",
    discount: "Giảm 30%",
    subtitle: "Combo Ngọt Ngào",
    desc: "Thưởng thức bắp rang bơ khổng lồ và nước ngọt không giới hạn. Tiết kiệm hơn khi mua online!",
    icon: Sparkles,
    bgFrom: "from-orange-500",
    bgTo: "to-yellow-400",
    textColor: "text-yellow-400",
  },
  {
    id: 3,
    title: "Trải Nghiệm VIP",
    badge: "Đặc Quyền Riêng",
    discount: "Đồng Giá",
    subtitle: "99k / vé VIP",
    desc: "Ghế da cao cấp, không gian riêng tư sang trọng. Tận hưởng điện ảnh đỉnh cao với giá siêu hời.",
    icon: Crown,
    bgFrom: "from-rose-500",
    bgTo: "to-pink-500",
    textColor: "text-rose-400",
  }
];

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // Luôn hiển thị mỗi khi reload trang
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Tự động chuyển quảng cáo mỗi 30 giây
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 30000); // 30s
    return () => clearInterval(interval);
  }, [isOpen]);

  // Lắng nghe sự kiện từ Header để mở popup
  useEffect(() => {
    const handleOpenPromo = () => setIsOpen(true);
    window.addEventListener('open-promo-popup', handleOpenPromo);
    return () => window.removeEventListener('open-promo-popup', handleOpenPromo);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const ad = ads[currentAdIndex];
  const Icon = ad.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      {/* Nền tối làm mờ */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
        onClick={closePopup}
      ></div>

      {/* Nội dung Popup - Thu nhỏ khung: max-w-sm thay vì max-w-lg */}
      <div className="relative w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Nút đóng */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/10"
        >
          <X size={16} />
        </button>

        {/* Phần Banner Phía Trên đổi màu động */}
        <div className={`relative h-40 bg-gradient-to-r ${ad.bgFrom} ${ad.bgTo} flex flex-col items-center justify-center overflow-hidden transition-all duration-700`}>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-[30px]"></div>

          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl mb-3 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Icon size={24} className="text-white drop-shadow-md" />
          </div>
          <h2 key={ad.id} className="relative z-10 text-2xl font-black text-white uppercase tracking-widest drop-shadow-lg text-center px-4 animate-in slide-in-from-bottom-2">
            {ad.title}
          </h2>
        </div>

        {/* Phần Nội Dung Phía Dưới */}
        <div className="p-6 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} className={ad.textColor} /> {ad.badge}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            <span className={`${ad.textColor} text-3xl font-black transition-colors block mb-1`}>{ad.discount}</span>
            {ad.subtitle}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-6 h-[4.5rem]">
            {ad.desc}
          </p>

          <div className="flex flex-col gap-2.5">
            <Link 
              href="/offers" 
              onClick={closePopup}
              className={`flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r ${ad.bgFrom} ${ad.bgTo} text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-[1.02] shadow-lg transition-all`}
            >
              <Ticket size={18} /> Nhận Ưu Đãi
            </Link>
          </div>

          {/* Dấu chấm chỉ báo slide */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {ads.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentAdIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentAdIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-slate-700 hover:bg-slate-500'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
