import { NextResponse } from 'next/server'

// Đây là mock API. Trong thực tế bạn có thể gắn Vercel AI SDK, Google Gemini hoặc OpenAI API vào đây.
export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const msgLower = message.toLowerCase()

    let reply = "Xin lỗi, hiện tại tôi chưa hiểu ý bạn. Vui lòng nói rõ hơn về suất chiếu hoặc phim bạn muốn xem nhé!"

    if (msgLower.includes('chào') || msgLower.includes('hello')) {
      reply = "Xin chào! Rất vui được hỗ trợ bạn. Bạn muốn đặt vé phim gì hôm nay?"
    } else if (msgLower.includes('phim mới') || msgLower.includes('hành động') || msgLower.includes('đang chiếu')) {
      reply = "Hiện tại N_thera đang chiếu các siêu phẩm như \n1. Vùng Đất Cát 2 (Dune: Part Two) \n2. Godzilla x Kong \nBạn muốn xem chi tiết phim nào?"
    } else if (msgLower.includes('vé') || msgLower.includes('đặt') || msgLower.includes('giá')) {
      reply = "Để đặt vé, bạn hãy chọn phim ở Trang chủ, sau đó chọn Rạp và Suất chiếu nhé. Giá vé tại N_thera dao động từ 80.000đ - 120.000đ tùy loại ghế và ngày chiếu."
    } else if (msgLower.includes('thanh toán') || msgLower.includes('momo') || msgLower.includes('vnpay')) {
      reply = "N_thera hỗ trợ thanh toán qua quét mã QR động tự động (VietQR/Momo). Quá trình đối soát diễn ra chỉ trong 3 giây cực kỳ hiện đại!"
    }

    // Giả lập delay của AI
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
