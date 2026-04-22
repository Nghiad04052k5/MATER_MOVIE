import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { GoogleGenAI } from '@google/genai'

// Initialize GenAI (requires GEMINI_API_KEY in .env.local)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    // Connect to Supabase to fetch context data
    const supabase = await createClient()

    // Query active movies
    const { data: movies } = await supabase
      .from('movies')
      .select('title, rating, duration_min')
      .order('created_at', { ascending: false })
      .limit(5)

    // Query upcoming showtimes (today)
    const { data: showtimes } = await supabase
        .from('showtimes')
        .select('start_time, movies(title), rooms(cinemas(name))')
        .order('start_time')
        .limit(5)

    let contextText = ''
    if (movies && movies.length > 0) {
        contextText += `Danh sách phim đang HOT tại rạp: ` + movies.map(m => `${m.title} (${m.duration_min} phút, điểm: ${m.rating})`).join(', ') + `. `
    }
    if (showtimes && showtimes.length > 0) {
        contextText += `Suất chiếu sắp tới: ` + showtimes.map((st: any) => {
            const time = new Date(st.start_time).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })
            return `${st.movies?.title} lúc ${time} tại ${st.rooms?.cinemas?.name}`
        }).join('; ') + `. `
    }

    const systemInstruction = `Bạn là trợ lý ảo AI tên là N_thera AI tại rạp chiếu phim N_thera Smart Cinema.
Nhiệm vụ của bạn là tư vấn phim, lịch chiếu và cách đặt vé cho khách hàng.
Bạn phải trả lời tự nhiên, thân thiện và ngắn gọn.
Tuyệt đối chỉ sử dụng dữ liệu ngữ cảnh mà hệ thống cung cấp dưới đây, KHÔNG bịa ra phim hay lịch chiếu khác.
Quy định Giá Vé: Mức giá cơ bản dao động từ 80.000đ đến 120.000đ. Ghế VIP sẽ phụ thu thêm 20.000đ.
Nếu khách hỏi ngoài lề (không phải phim hay rạp), hãy lịch sự từ chối và hướng về rạp phim.
Thông tin ngữ cảnh phim và Lịch chiếu hiện tại (từ Database): ${contextText || "Chưa có suất chiếu hoặc phim mới nào hôm nay."}
Giờ hãy trả lời câu hỏi của khách hàng.`

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            message
        ],
        config: {
            systemInstruction
        }
    });

    const reply = response.text || "Xin lỗi, N_thera AI đang nâng cấp, bạn vui lòng thử lại sau nhé."
    
    return NextResponse.json({ reply })
  } catch (err: unknown) {
    console.error("Gemini Error:", err)
    // Nếu có lỗi hệ thống hoặc 503 Service Unavailable từ phía máy chủ Google, trả về câu trả lời lịch sự cho client.
    const fallbackReply = "Hệ thống AI hiện đang chịu tải cao nên không thể phản hồi ngay lập tức. Bạn vui lòng thử chặn vài giây rồi hỏi lại nhé!";
    return NextResponse.json({ reply: fallbackReply })
  }
}
