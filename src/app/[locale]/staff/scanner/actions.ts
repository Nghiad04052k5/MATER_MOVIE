'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function scanTicket(ticketId: string) {
  const supabase = await createClient()

  // Verify the user is Staff
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'staff@nthera.vn') {
     return { success: false, message: 'Unauthorized. You must have Staff role to scan tickets.' }
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('id, status, showtime_id, total_amount')
    .eq('id', ticketId)
    .single()

  if (error || !ticket) {
    return { success: false, message: 'Mã vé không tồn tại hoặc đã bị đổi.' }
  }

  if (ticket.status === 'USED') {
    return { success: false, message: '❌ CẢNH BÁO: Vé này đã được sử dụng trước đó. Cấm vào rạp!' }
  }

  if (ticket.status !== 'PAID') {
    return { success: false, message: `Vé này không hợp lệ. Trạng thái hiện tại: ${ticket.status}` }
  }

  // Update trang thai thanh USED
  const { error: updateError } = await supabase
    .from('tickets')
    .update({ status: 'USED' })
    .eq('id', ticketId)

  if (updateError) {
    return { success: false, message: 'Lỗi khi cập nhật trạng thái vé.' }
  }

  revalidatePath('/staff/scanner')
  return { success: true, message: 'Soát vé thành công! Mời khách vào.', ticket }
}
