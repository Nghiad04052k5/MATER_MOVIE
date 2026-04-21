import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Đây là mock API có khả năng truy xuất Database thật để trả lời thông minh
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const msgLower = message.toLowerCase()
    
    // Khởi tạo Supabase để tự truy vấn dữ liệu thay vì nói xạo
    const supabase = await createClient()

    let reply = "Xin lỗi, hiện tại tôi chưa hiểu ý bạn. Vui lòng nói rõ hơn về 'suất chiếu', 'phim mới' hoặc thủ tục 'đặt vé' nhé!"

    if (msgLower.includes('chào') || msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('bn') || msgLower.includes('giúp') || msgLower.includes('hỗ trợ') || msgLower.includes('tl')) {
      reply = "Xin chào! Rất vui được hỗ trợ bạn. Tôi là Trợ lý ảo AI của N_Thera. Bạn muốn tìm thông tin phim gì, hay muốn hướng dẫn đặt vé?"
    } 
    else if ((msgLower.includes('phim') && (msgLower.includes('mới') || msgLower.includes('đang chiếu') || msgLower.includes('hay'))) || msgLower.includes('có phim gì')) {
      // Query 3 phim mới nhất
      const { data: movies } = await supabase.from('movies').select('title, rating').order('created_at', { ascending: false }).limit(3)
      if (movies && movies.length > 0) {
        reply = "Hiện tại rạp N_thera đang có các phim rất hot: \n" + movies.map(m => `- ${m.title} (⭐ ${m.rating} điểm)`).join('\n') + "\nBạn có muốn xem Lịch chiếu không?"
      } else {
        reply = "Hiện tại hệ thống phim đang được cập nhật thêm. Bạn xem lại sau nhé."
      }
    } 
    else if (msgLower.includes('hôm nay') || msgLower.includes('suất chiếu') || msgLower.includes('lịch chiếu')) {
      const { data: showtimes } = await supabase.from('showtimes').select('start_time, movies(title), rooms(cinemas(name))').order('start_time').limit(3)
      if (showtimes && showtimes.length > 0) {
        let list = ""
        showtimes.forEach((st: any) => {
           const time = new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
           list += `- Phim ${st.movies?.title} lúc ${time} tại ${st.rooms?.cinemas?.name}\n`
        })
        reply = "Đây là một số suất chiếu sắp tới:\n" + list + "\nĐể xem đầy đủ hơn, bạn hãy nhấn vào mục [Lịch chiếu] ở Thanh Menu bên trên nhé!"
      } else {
        reply = "Hiện tại rạp chưa có suất chiếu nào được lên lịch cho hôm nay."
      }
    } 
    else if (msgLower.includes('vé') || msgLower.includes('đặt') || msgLower.includes('giá')) {
      reply = "Để đặt vé, bạn hãy bấm vào Lịch chiếu, chọn Suất chiếu và tiến hành Chọn Ghế. Giá vé tại N_thera dao động từ 80.000đ - 120.000đ tùy loại ghế (VIP hoặc Thường)."
    } 
    else if (msgLower.includes('thanh toán') || msgLower.includes('momo') || msgLower.includes('qr')) {
      reply = "N_thera hỗ trợ thanh toán qua quét mã QR động tự động (VietQR/Momo). Quá trình đối soát diễn ra siêu tốc độ chỉ trong 3-5 giây là vé tự động đổ về tài khoản của bạn!"
    }

    // Giả lập delay suy nghĩ của AI
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({ reply })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
