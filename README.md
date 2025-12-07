# Hệ thống Quản lý Cửa hàng Trang sức

Dự án website quản lý cửa hàng vàng bạc đá quý, bao gồm Backend (Node.js/Express) và Frontend (ReactJS/Vite).

---

## Yêu cầu hệ thống (Prerequisites)

Để chạy được dự án này, máy tính cần cài đặt sẵn:

1.  **Node.js**
2.  **MySQL** (XAMPP).
3.  **Git**.

---

## Hướng dẫn Cài đặt & Chạy chi tiết

Để hệ thống hoạt động, bạn cần chạy theo thứ tự: **Database** -> **Backend** -> **Frontend**.

### Bước 1: Cấu hình Database

Trước khi chạy code, bạn cần khởi tạo cơ sở dữ liệu.

1.  Mở **XAMPP**, bật **Apache** và **MySQL** (nút Start).
2.  Truy cập `http://localhost/phpmyadmin`.
3.  Tạo một Database mới tên là: `qlbh` (chính xác tên này).
4.  Chọn database `qlbh` vừa tạo, vào tab **Import** và tải file `.sql` của dự án lên (file data mẫu).

---

### Bước 2: Cài đặt và Chạy Backend

Server sẽ chạy ở cổng `8080`.

1.  Mở terminal trong VS Code.
2.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```
3.  Cài đặt các thư viện cần thiết (chỉ làm lần đầu):
    ```bash
    npm install
    ```
4.  Khởi động Server:
    ```bash
    npm start
    ```
    > **Dấu hiệu thành công:** Terminal hiện thông báo:
    > `Server đang chạy ở port http://localhost:8080` > `Kết nối Database qlbh thành công!`

**Lưu ý:** Giữ nguyên Terminal này, **KHÔNG ĐƯỢC TẮT** để server luôn chạy.

---

### 3️Bước 3: Cài đặt và Chạy Frontend (Client)

Frontend sẽ chạy ở cổng `5173`.(mặc định)

1.  Mở thêm một Terminal mới (lưu ý terminal backend vẫn phải được chạy).
2.  Di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```
3.  Cài đặt các thư viện (chỉ làm lần đầu):
    ```bash
    npm install
    ```
4.  Chạy dự án:
    ```bash
    npm run dev
    ```
5.  Giữ phím **Ctrl** và click vào đường link hiện ra trên terminal (ví dụ: `http://localhost:5173`) để mở trình duyệt.
