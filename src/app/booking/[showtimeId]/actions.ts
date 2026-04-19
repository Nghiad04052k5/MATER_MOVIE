'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Hàm Xử lý Đặt Vé
export async function bookSeats(formData: FormData) {
  const supabase = await createClient()

  // 1. Kiểm tra tài khoản User đang mua vé
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để đặt vé.' }
  }

  const showtime_id = formData.get('showtime_id') as string
  const total_amount = parseFloat(formData.get('total_amount') as string)
  const seatIdsStr = formData.get('seat_ids') as string
  
  if (!seatIdsStr) return { success: false, message: 'Vui lòng chọn ít nhất 1 ghế ngồi.' }
  const seatIds: string[] = JSON.parse(seatIdsStr)

  // 2. Tạo giao dịch Mua Vé mới (Bảng tickets)
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert([{
       user_id: user.id,
       showtime_id,
       total_amount,
       status: 'PENDING'
    }])
    .select('id')
    .single()

  if (ticketError || !ticket) {
    return { success: false, message: 'Không thể tạo đơn hàng vé: ' + (ticketError?.message || '') }
  }

  // 3. Chuẩn bị dữ liệu ghi vào bảng ticket_seats (Giữ ghế)
  const ticketSeatsData = seatIds.map(seat_id => ({
     ticket_id: ticket.id,
     seat_id,
     showtime_id
  }))

  // 4. Insert và hứng lỗi "Race Condition" cực định cao
  const { error: tsError } = await supabase
    .from('ticket_seats')
    .insert(ticketSeatsData)

  if (tsError) {
    // Nếu Postgres báo lỗi 23505 Unique Violation = Chống trùng ghế thành công!
    if (tsError.code === '23505') {
       // Rollback xóa cái ticket bị dư (vì ghế đã có người mua hớt tay trên)
       await supabase.from('tickets').delete().eq('id', ticket.id)
       return { success: false, message: 'Ối! Đã có khách hàng khác hớt tay trên ghế của bạn chỉ trong tíc tắc. Vui lòng tải lại trang và chọn ghế khác nha!' }
    }
    return { success: false, message: 'Lỗi ghi nhận ghế: ' + tsError.message }
  }

  revalidatePath(`/booking/${showtime_id}`)
  return { success: true, ticket_id: ticket.id }
}
