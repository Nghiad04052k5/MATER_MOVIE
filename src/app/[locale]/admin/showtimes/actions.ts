'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ===== 1. TẠO CỤM RẠP =====
export async function addCinema(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const address = formData.get('address') as string

  if (!name || !address) return { success: false, message: 'Thiếu thông tin' }

  const { error } = await supabase.from('cinemas').insert([{ name, address }])
  if (error) return { success: false, message: error.message }
  
  revalidatePath('/admin/showtimes')
  return { success: true }
}

// ===== 2. TẠO PHÒNG CHIẾU & TỰ ĐỘNG SINH SƠ ĐỒ GHẾ NGỒI =====
export async function addRoom(formData: FormData) {
  const supabase = await createClient()
  const cinema_id = formData.get('cinema_id') as string
  const name = formData.get('name') as string
  
  // Mặc định tạo phòng 100 chỗ (10x10) cho Đồ án
  const capacity = 100

  // 2.1: Insert phòng chiếu
  const { data: roomResult, error: roomError } = await supabase
    .from('rooms')
    .insert([{ cinema_id, name, total_capacity: capacity }])
    .select('id')
    .single()

  if (roomError || !roomResult) return { success: false, message: roomError?.message }

  // 2.2: Ngầm tự động sinh Sơ đồ ghế (Ma trận 10 x 10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const seatsData = []
  
  for (let r = 0; r < rows.length; r++) {
    for (let c = 1; c <= 10; c++) {
      let type = 'STANDARD'
      // 2 Hàng cuối làm ghế VIP (giá sẽ hệ số cao hơn)
      if (rows[r] === 'I' || rows[r] === 'J') {
         type = 'VIP'
      }
      seatsData.push({
        room_id: roomResult.id,
        seat_row: rows[r],
        seat_col: c,
        seat_type: type,
        status: 'AVAILABLE'
      })
    }
  }

  // Insert 100 ghế vào CSDL
  const { error: seatError } = await supabase.from('seats').insert(seatsData)
  
  if (seatError) return { success: false, message: 'Tạo phòng thành công nhưng lỗi sinh ghế: ' + seatError.message }

  revalidatePath('/admin/showtimes')
  return { success: true }
}

// ===== 3. TẠO SUẤT CHIẾU =====
export async function addShowtime(formData: FormData) {
  const supabase = await createClient()
  const movie_id = formData.get('movie_id') as string
  const room_id = formData.get('room_id') as string
  const start_time = formData.get('start_time') as string
  const base_price = parseFloat(formData.get('base_price') as string)

  const { error } = await supabase
    .from('showtimes')
    .insert([{ movie_id, room_id, start_time, base_price }])

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/admin/showtimes')
  return { success: true }
}
