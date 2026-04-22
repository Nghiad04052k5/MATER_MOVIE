import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { ticket_id } = await request.json()

    if (!ticket_id) {
      return NextResponse.json({ success: false, message: 'Missing ticket_id' }, { status: 400 })
    }

    const supabase = await createClient()

    // Cập nhật trạng thái vé thành PAID
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'PAID' })
      .eq('id', ticket_id)

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Payment simulated successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
