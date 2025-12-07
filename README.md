# Hệ thống Quản lý Cửa hàng Trang sức (Jewelry Management System)

Đây là ứng dụng web quản lý cửa hàng vàng bạc đá quý, bao gồm các chức năng quản lý sản phẩm, tồn kho và hiển thị danh sách sản phẩm.

## Công nghệ sử dụng

- **Frontend:** ReactJS, Ant Design, CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.

## Yêu cầu cài đặt

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt:

1.  **Node.js**: (Phiên bản 14 trở lên).
2.  **MySQL**: (Thông qua XAMPP).
3.  **Git**: Để clone source code.

---

## Hướng dẫn cài đặt và chạy

### Bước 1: Cấu hình Cơ sở dữ liệu (Database)

1.  Mở phần mềm quản lý Database (phpMyAdmin hoặc MySQL Workbench).
2.  Tạo một database mới tên là: `qlbh`
3.  Import file SQL:
    - Tìm file `.sql` trong thư mục source code (`backend/sql/data.sql`).
    - Import file này vào database `qlbh` vừa tạo để có database.
4.  **Lưu ý cấu hình:**
    - Mở file `backend/src/config/connectDB.js`.
    - Kiểm tra thông tin `user` (thường là 'root') và `password` (để trống hoặc điền pass của bạn) xem đã khớp với máy bạn chưa.

### Bước 2: Cài đặt và chạy Backend

Mở một cửa sổ Terminal (CMD/PowerShell) và chạy các lệnh sau:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện (node_modules)
npm install

# 3. Chạy server
npm start
```
