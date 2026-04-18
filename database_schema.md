# Cấu Trúc Database (Supabase SQL)

> [!IMPORTANT]
> Vì Supabase là cơ sở dữ liệu trên đám mây, hãy làm theo hướng dẫn dưới đây để nạp cấu trúc (schema) chuẩn cho Hệ thống N_thera.

### Hướng dẫn cách tạo:
1. Truy cập vào trang quản trị Supabase của dự án `mauydaywmlgbraxbsnid`.
2. Bấm vào trình đơn **SQL Editor** ở thanh menu bên trái.
3. Tạo 1 thanh New Query mới, dán toàn bộ đoạn mã SQL bên dưới vào và chọn **RUN**.

```sql
-- Kích hoạt extension hỗ trợ UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bảng 1: Phim (Movies)
CREATE TABLE public.movies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    poster_url TEXT,
    trailer_url TEXT,
    duration_mins INT NOT NULL,
    release_date DATE,
    rating DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 2: Cụm rạp (Cinemas)
CREATE TABLE public.cinemas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 3: Phòng chiếu (Rooms) 
-- Nằm trong cụm rạp nào đó
CREATE TABLE public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cinema_id UUID REFERENCES public.cinemas(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    total_capacity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 4: Suất chiếu (Showtimes)
CREATE TABLE public.showtimes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 5: Xác định các Ghế trong phòng (Seats)
CREATE TABLE public.seats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    seat_row VARCHAR(5) NOT NULL, -- e.g. A, B, C
    seat_col INT NOT NULL,        -- e.g. 1, 2, 3
    seat_type VARCHAR(20) DEFAULT 'STANDARD', -- VÍ dụ: VIP, SWEETBOX
    status VARCHAR(20) DEFAULT 'AVAILABLE',   -- AVAILABLE, MAINTENANCE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(room_id, seat_row, seat_col)
);

-- Bảng 6: Lịch sử thanh toán Vé (Tickets)
CREATE TABLE public.tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Liên kết đến Auth Users của Supabase
    showtime_id UUID REFERENCES public.showtimes(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED
    webhook_transaction_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 7: Ghế đã giữ/bán trong từng Vé (Ticket_Seats)
-- Gắn liền 1 suất chiếu cụ thể nào đó để kiểm soát chống trùng Database
CREATE TABLE public.ticket_seats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES public.seats(id) ON DELETE CASCADE,
    showtime_id UUID REFERENCES public.showtimes(id) ON DELETE CASCADE,
    hold_expires_at TIMESTAMP WITH TIME ZONE, -- Dùng cho việc chống Race condition (Khóa trong 10 phút)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(showtime_id, seat_id) -- Điểm cốt lõi: 1 Ghế trong 1 Suất Chiếu chỉ được tồn tại 1 lần duy nhất trong bảng này.
);
```

> [!TIP]
> Việc xây dựng Database chuẩn ngay từ đầu sẽ giúp bạn tránh mọi rủi ro viết Code xử lý luồng đặt vé lỏng lẻo sau này. Đặc biệt chú ý Unique Constraint ở bảng 7 `UNIQUE(showtime_id, seat_id)` - hệ gen mấu chốt để fix bug trùng vé mà giáo viên rất thích!
