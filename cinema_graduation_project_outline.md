# ĐỀ CƯƠNG ĐỒ ÁN TỐT NGHIỆP: HỆ SINH THÁI RẠP CHIẾU PHIM THÔNG MINH N_THERA

> [!NOTE]
> Đây là bản Báo cáo Tổng hợp (Master File) hoàn chỉnh nhất. Tài liệu này kết hợp cấu trúc nghiệp vụ chuẩn mực của hệ thống rạp phim truyền thống, cùng với những công nghệ giải quyết triệt để các khiếm khuyết về UX/UI, Thanh toán, Realtime và AI.

## 1. Thông Tin Đề Tài & Định Hướng Thương Hiệu
- **Tên Đề Tài (Tiếng Việt):** Xây dựng Hệ sinh thái Rạp chiếu phim Thông minh N_thera tích hợp Trợ lý ảo AI.
- **Tên Đề Tài (Tiếng Anh):** Design and Development of N_thera Smart Cinema Ecosystem with AI Virtual Assistant.
- **Mục Tiêu:** Xây dựng một nền tảng thương mại điện tử chuyên biệt (đặt vé rạp phim) hoàn toàn tự động, giải quyết dứt điểm rủi ro trùng lắp dữ liệu, tối ưu hóa giao tiếp thời gian thực, và ứng dụng AI để tra cứu thông tin doanh nghiệp.

---

## 2. Ngăn Xếp Công Nghệ Cốt Lõi (Tech Stack Mới Nhất)

*   **Frontend (Ứng Dụng Khách Hàng & Admin):**
    *   **Next.js / React:** Tối ưu hóa SEO và render giao diện siêu tốc.
    *   **TailwindCSS:** Chuyên trị thiết kế giao diện cao cấp (*Premium UI*). Áp dụng Dark Mode, hiệu ứng Kính mờ (Glassmorphism), màu hitech Neon (Xanh/Tím) phù hợp với định vị thương hiệu N_thera.
*   **Backend & Cơ Sở Dữ Liệu (Trái Tim Hệ Thống):**
    *   **Supabase (BaaS):** Nền tảng thay cho Backend truyền thống.
        - *Supabase Auth:* Tự động quản lý đăng nhập/đăng ký siêu bảo mật.
        - *PostgreSQL:* Xây dựng CSDL quan hệ chặt chẽ.
        - *Supabase Realtime:* Công nghệ WebSockets cho phép dữ liệu (vé, ghế trống) nhảy số tức thời.
*   **Tích Hợp API Thứ 3 (External Services):**
    *   **TMDB API:** Đồng bộ tự động Poster và thông tin phim đang chiếu ngoài rạp thật.
    *   **VNPay / Momo Sandbox:** Cổng thanh toán áp dụng cơ chế *Webhook*.
    *   **OpenAI / Gemini:** AI Chatbot dùng cấu trúc trúc *Function Calling (RAG)*.

---

## 3. Kiến Trúc "Sửa Lỗi" Các Nỗi Đau Của Phiên Bản Cũ

> [!IMPORTANT]
> Đây là những điểm sáng chói nhất dùng để lập luận khi bảo vệ Đồ án trước hội đồng.

1.  **Thanh Toán Tự Động Toàn Phần (Không Cần Admin Duyệt):**
    Sử dụng **Webhook**. Khi khách thanh toán trên điện thoại, máy chủ Momo/VNPay lập tức gọi HTTP ngầm về Backend N_thera. Trạng thái Vé tự động lật thành "PAID", mã vé Barcode tự sinh ra và gửi thẳng vào Email khách hàng. Admin hoàn toàn được giải phóng.
2.  **Đồng Bộ Tức Thời Trên Mọi Thiết Bị (Supabase WebSockets):**
    Các màn hình của Admin không cần F5 tải lại trang. Các máy tính Quản trị sẽ Đăng ký (Subscribe) lắng nghe DB. Một khách hàng mua vé ở xa thành công, bảng xếp hạng và biểu đồ doanh thu của Admin sẽ tự nháy số cập nhật trong một phần nghìn giây.
3.  **Trợ Lý Ảo N_thera AI "Hiểu" Database:**
    Cấp quyền truy cập hàm nội bộ (*Function Calling*) cho AI. Khi khách hỏi "Chiều nay có phim Hành động nào?", AI không bịa câu trả lời, mà tự động ngầm viết query đếm suất chiếu trên DB Supabase, sau đó mới dịch ra câu trả lời tự nhiên tặng khách. Có kết hợp lưu trữ lịch sử chat để khách không bị gián đoạn.

---

## 4. Phân Tích Chức Năng Cốt Lõi (Modules)

### Truy cập Khách Hàng (B2C N_thera)
- **Tài khoản cá nhân:** Đăng nhập, Profile lưu lại QRCode/Barcode của vé để quét khi vào rạp.
- **Trải nghiệm phim ảnh:** Phim (Now Playing/Upcoming) lấy từ lưới TMDB tự động. Có tích hợp Chatbot ở góc phải.
- **Luồng Booking thông minh:**
    1. Chọn Cụm Rạp -> Ngày -> Suất chiếu.
    2. **Ma trận Sơ đồ ghế:** Hiển thị trực quan (Trống, Đang có người chọn, Đã bán). Loại ghế màu sắc khác nhau (VIP, Sweetbox).
    3. Thanh toán Webhook (đã đề cập).

### Phân Hệ Quản Trị Hệ Thống (B2B Admin Dashboard)
- **Dashboard Thống Kê:** Biểu đồ Realtime trực quan với Chart.js/Recharts.
- **Quản lý Nguồn Phim:** Nút "Fetch TMDB" để kéo 50 phim mới nhất về Data của rạp mình chỉ với 1 click.
- **Cấu trúc Rạp & Lịch Chiếu:**
    - Khởi tạo Rạp -> Khởi tạo Phòng chiếu -> **Vẽ Bản đồ lưới Ghế (X/Y)**.
    - Lên lịch các Suất chiếu (Ngăn chặn xếp trùng phim vào cùng 1 giờ / 1 phòng).
- **Quản lý Tài khoản (User):** Không duyệt mở tài khoản thủ công, chỉ thao tác khóa (Ban) người dùng gian lận.

---

## 5. Thiết Kế Cơ Sở Dữ Liệu (ERD Outline chuẩn Xác)

1. `Users`: (Quản lý ID người dùng)
2. `Movies`: (Dữ liệu từ TMDB, Tên phim, Thể loại...)
3. `Cinemas`: (Cụm rạp N_thera chi nhánh 1, chi nhánh 2...)
4. `Rooms`: (Tổng số ghế, Rạp chứa)
5. `Seats`: (Định nghĩa ghế "A1", Loại ghế). *Ghế là thực thể sinh ra dính chặt vào Room*
6. `Showtimes`: (Lịch chiếu: Giờ bắt đầu, thời lượng, nối với Movies + Rooms)
7. `Tickets`: (Hóa đơn, ID người mua, Trạng thái: Chờ thanh toán/Đã trả tiền/Hủy)
8. `Ticket_Seats`: (Đây là Bảng trung gian móc nối Ticket với Seat). Rất quan trọng để check xem ghế này ở suất chiếu này đã bán hay chưa.

---

## 6. Bài Toán Kỹ Thuật Nâng Cao (Bonus Chống Trừ Điểm)

### Xử Lý "Race Condition" (Thuật toán Khoá Ghế)
- **Kịch bản:** 10 khách cùng lúc bấm vào ghế VIP VIP1.
- **Cách giải quyết:** Áp dụng cơ chế **Locking** trên CSDL kết hợp Supabase (hoặc Redis). Người click thanh toán đầu tiên (xét theo miliseconds) sẽ tạo ra một hàng trạng thái khóa (Hold) ghế trong vòng *10 phút*. Trình duyệt của 9 người kia ngay thời điểm đó (nhờ Supabase Realtime) sẽ tự thấy ghế VIP1 nháy biến thành màu Đỏ "Đang có người giữ chỗ" mà họ không thể nhấp vào được nữa. Nếu quá 10 phút, tự động nhả ghế.

---

## 7. Giới Hạn Đề Tài & Hướng Giải Quyết Các Bài Toán Thực Tế
Trong luồng kinh doanh thực tế, hệ thống rạp chiếu phát sinh nhiều nghiệp vụ phức tạp. Đồ án N_thera thiết lập các giới hạn (Scope) như sau để đảm bảo tính khả thi:

### 7.1. Bài toán Hoàn / Hủy Vé (Refund Policy)
- **Vấn đề:** Giao dịch qua cổng thanh toán (Momo/VNPay) nếu hủy vé sẽ tốn từ 3-5 ngày làm việc để hoàn tiền, làm phức tạp luồng đối soát kế toán.
- **Giải pháp của N_thera:** Áp dụng chính sách **"All sales are final" (Không hoàn/hủy)**. Khách hàng bắt buộc phải check vào ô "Đồng ý không hoàn tiền" trước khi Submit thanh toán. Việc này làm gọn nhẹ luồng CSDL nhưng vẫn rất thực tế (nhiều hệ thống mua vé sự kiện cũng đang áp dụng).

### 7.2. Bài toán Giá Vé Động (Dynamic Pricing)
- **Vấn đề:** Giá vé thực tế không cố định mà phụ thuộc vào: Loại khách (HSSV/Người lớn), Loại ghế (Thường/VIP), và Thời điểm (Ngày thường/Cuối tuần/Lễ).
- **Giải pháp của N_thera:** Cấu trúc Backend sẽ xây dựng bảng `Ticket_Types` chuyên biệt lấy mốc là "Giá vé gốc". Công thức tính doanh thu: `Tổng tiền = Giá vé gốc + Phụ thu (nếu vào T7/CN) + Hệ số loại ghế (VD: VIP nhân 1.5)`. Điều này chứng minh cho hội đồng thấy thuật toán tính giá của hệ thống vô cùng linh hoạt.

### 7.3. Phân Quyền Nhân Viên Quét Mã (Role-Based Ticket Scanner)
- **Vấn đề:** Mọi hệ thống trước đây chỉ có quyền [User] và quyền [Admin Cao Cấp]. Khuyết mất quyền của "Nhân viên Soát vé tại cửa".
- **Giải pháp của N_thera:** Bổ sung Role `[Staff]`. Tài khoản Staff khi đăng nhập sẽ chỉ thấy **DUY NHẤT 1 màn hình Camera Quét Barcode/QR Code**. Khách tới đưa điện thoại -> Staff quét -> Nếu hợp lệ, hệ thống báo XANH và tự Update database thành "Đã sử dụng" để tránh dùng lại vé. 
