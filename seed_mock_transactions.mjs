import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('Bắt đầu bơm dữ liệu giả (Mock Data)...');

  // 1. Lấy thông tin user hiện tại (giả định dùng admin@nthera.vn hoặc tài khoản đầu tiên)
  // Vì ANON_KEY không thể đọc auth.users trực tiếp, ta giả lập hoặc nếu có RLS bypass thì tốt.
  // Tuy nhiên, ta có thể tạo vé mà bỏ trống user_id (hoặc nếu yêu cầu, ta sẽ bỏ qua).
  // Chờ đã: bảng tickets có user_id REFERENCES auth.users(id). 
  // Để an toàn, mình sẽ không gán user_id nếu không query được.
  
  // Tuy nhiên, ở đây ta sẽ dùng tài khoản admin hiện tại nếu có, hoặc fetch user từ tickets cũ.
  // Thử đăng nhập bằng admin@nthera.vn để lấy session:
  // Lưu ý: Nếu RLS chặn insert, đoạn này có thể bị lỗi do Anon Key.
  // Nếu bạn đang chạy local dev và tắt RLS, thao tác insert sẽ thành công.

  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@nthera.vn',
    password: 'password123' // Giả định
  });
  
  let userId = authData?.user?.id;
  if (!userId) {
    console.log('Không lấy được User ID qua auth (có thể sai mật khẩu), tiếp tục không dùng user_id...');
  } else {
    console.log('Đã đăng nhập Admin:', userId);
  }

  // 2. Lấy ngẫu nhiên 1 suất chiếu
  const { data: showtimes } = await supabase.from('showtimes').select('id, base_price, movies(title)').limit(1);
  if (!showtimes || showtimes.length === 0) {
    console.error('Không tìm thấy suất chiếu nào trong database! Vui lòng Sync phim và tạo suất chiếu trước.');
    return;
  }
  const showtime = showtimes[0];

  // 3. Tạo 3 giao dịch vé
  const mockTickets = [
    {
      showtime_id: showtime.id,
      total_amount: showtime.base_price * 2 + 40000,
      status: 'PAID',
      webhook_transaction_id: 'VNQR_82739182',
      user_id: userId || null
    },
    {
      showtime_id: showtime.id,
      total_amount: showtime.base_price,
      status: 'PAID',
      webhook_transaction_id: 'VNQR_11928374',
      user_id: userId || null
    },
    {
      showtime_id: showtime.id,
      total_amount: showtime.base_price * 4,
      status: 'PENDING',
      webhook_transaction_id: null,
      user_id: userId || null
    }
  ];

  console.log('Đang tạo Giao dịch Vé (Tickets)...');
  const { data: insertedTickets, error: ticketErr } = await supabase.from('tickets').insert(mockTickets).select();
  
  if (ticketErr) {
    console.error('Lỗi chèn Vé:', ticketErr.message);
  } else {
    console.log('✅ Đã tạo thành công', insertedTickets.length, 'vé!');
    
    // 4. Bắn thông báo (Notifications) cho User (Nếu có user_id)
    if (userId) {
      console.log('Đang bắn Thông báo cho User...');
      const notifications = insertedTickets.map(t => ({
        user_id: userId,
        title: t.status === 'PAID' ? 'Thanh toán thành công' : 'Đang chờ thanh toán',
        description: t.status === 'PAID' 
            ? `Vé xem phim ${showtime.movies?.title} của bạn đã được xuất. Mã vé: ${t.id.split('-')[0].toUpperCase()}`
            : `Giao dịch mua vé phim ${showtime.movies?.title} đang chờ bạn quét mã QR.`,
        is_read: false
      }));

      // Bắn thêm 1 thông báo khuyến mãi
      notifications.push({
        user_id: userId,
        title: '🌟 Siêu ưu đãi cuối tuần',
        description: 'Tặng bạn mã giảm 30% bắp nước khi mua kèm vé. Nhập mã BAPNUOC30 tại quầy.',
        is_read: false
      });

      const { error: notifErr } = await supabase.from('notifications').insert(notifications);
      if (notifErr) {
        console.error('Lỗi chèn Thông báo:', notifErr.message);
        console.log('👉 LƯU Ý: Có thể bạn chưa chạy Script SQL tạo bảng "notifications" trên Supabase!');
      } else {
        console.log('✅ Đã tạo thành công Thông báo hệ thống!');
      }
    }
  }

  console.log('🎉 Hoàn tất quá trình bơm dữ liệu!');
}

seedData();
