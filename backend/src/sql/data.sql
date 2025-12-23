DROP DATABASE IF EXISTS QLBH;
CREATE DATABASE QLBH;
USE QLBH;

-- Parameters table
CREATE TABLE THAMSO (
    TenThamSo NVARCHAR(100) PRIMARY KEY,
    TiLeTraTruoc FLOAT NOT NULL
);

-- Units table
CREATE TABLE DONVITINH (
    MaDVT VARCHAR(50) PRIMARY KEY,
    TenDVT NVARCHAR(100) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product categories table
CREATE TABLE LOAISANPHAM (
    MaLoaiSanPham VARCHAR(50) PRIMARY KEY,
    TenLoaiSanPham NVARCHAR(100) NOT NULL,
    MaDVT VARCHAR(50) NOT NULL,
    PhanTramLoiNhuan DECIMAL(5, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaDVT) REFERENCES DONVITINH(MaDVT)
);

-- Products table
CREATE TABLE SANPHAM (
    MaSanPham VARCHAR(50) PRIMARY KEY,
    TenSanPham NVARCHAR(100) NOT NULL,
    MaLoaiSanPham VARCHAR(50) NOT NULL,
    SoLuongTon INT DEFAULT 0,
    DonGiaMuaVao DECIMAL(18, 2) NOT NULL,
    DonGiaBanRa DECIMAL(18, 2) NOT NULL,
    HinhAnh VARCHAR(300),
    isDelete BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaLoaiSanPham) REFERENCES LOAISANPHAM(MaLoaiSanPham)
);

-- Customers table
CREATE TABLE KHACHHANG (
    MaKH VARCHAR(50) PRIMARY KEY,
    TenKH NVARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    DiaChi NVARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE NHACUNGCAP (
    MaNCC VARCHAR(50) PRIMARY KEY,
    TenNCC NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255),
    SoDienThoai VARCHAR(15),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Purchase orders table
CREATE TABLE PHIEUMUAHANG (
    SoPhieuMH VARCHAR(50) PRIMARY KEY,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    MaNCC VARCHAR(50) NOT NULL,
    TongTien DECIMAL(18, 2) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNCC) REFERENCES NHACUNGCAP(MaNCC)
);

-- Bảng chi tiết mua hàng
CREATE TABLE CHITIETMUAHANG (
    MaChiTietMH VARCHAR(50) PRIMARY KEY,
    SoPhieuMH VARCHAR(50) NOT NULL,
    MaSanPham VARCHAR(50) NOT NULL,
    SoLuongMua INT NOT NULL,
    DonGiaMua DECIMAL(18, 2) NOT NULL,
    ThanhTien DECIMAL(18, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SoPhieuMH) REFERENCES PHIEUMUAHANG(SoPhieuMH),
    FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham)
);

-- Sales orders table
CREATE TABLE PHIEUBANHANG (
    SoPhieuBH VARCHAR(50) PRIMARY KEY,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    MaKH VARCHAR(50) NOT NULL,
    TongTien DECIMAL(18, 2) DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

-- Bảng chi tiết bán hàng
CREATE TABLE CHITIETBANHANG (
    MaChiTietBH VARCHAR(50) PRIMARY KEY,
    SoPhieuBH VARCHAR(50) NOT NULL,
    MaSanPham VARCHAR(50) NOT NULL,
    SoLuongBan INT NOT NULL,
    DonGiaBan DECIMAL(18, 2) NOT NULL,
    ThanhTien DECIMAL(18, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SoPhieuBH) REFERENCES PHIEUBANHANG(SoPhieuBH),
    FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham)
);

-- Bảng loại dịch vụ
CREATE TABLE LOAIDICHVU (
    MaLoaiDV VARCHAR(50) PRIMARY KEY,
    TenLoaiDV NVARCHAR(100) NOT NULL,
    DonGiaDV DECIMAL(18, 2) DEFAULT 0,
    PhanTramTraTruoc DECIMAL(5, 2) DEFAULT 0.5,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng phiếu dịch vụ
CREATE TABLE PHIEUDICHVU (
    SoPhieuDV VARCHAR(50) PRIMARY KEY,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    MaKH VARCHAR(50) NOT NULL,
    TongTien DECIMAL(18, 2) DEFAULT 0,
    TongTienTraTruoc DECIMAL(18, 2) DEFAULT 0,
    TongTienConLai DECIMAL(18, 2) DEFAULT 0,
    TinhTrang NVARCHAR(50) DEFAULT N'Đang xử lý',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH)
);

-- Bảng chi tiết phiếu dịch vụ
CREATE TABLE CHITIETPHIEUDICHVU (
    MaChiTietDV VARCHAR(50) PRIMARY KEY,
    SoPhieuDV VARCHAR(50) NOT NULL,
    MaLoaiDV VARCHAR(50) NOT NULL,
    DonGiaDuocTinh DECIMAL(18, 2) NOT NULL,
    SoLuong INT NOT NULL,
    ThanhTien DECIMAL(18, 2) NOT NULL,
    TraTruoc DECIMAL(18, 2) DEFAULT 0,
    ConLai DECIMAL(18, 2) DEFAULT 0,
    NgayGiao DATETIME,
    TinhTrang NVARCHAR(50) DEFAULT N'Chưa hoàn thành',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SoPhieuDV) REFERENCES PHIEUDICHVU(SoPhieuDV),
    FOREIGN KEY (MaLoaiDV) REFERENCES LOAIDICHVU(MaLoaiDV)
);

-- Inventory reports
CREATE TABLE BAOCAOTONKHO (
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    MaSanPham VARCHAR(50) NOT NULL,
    TonDau INT DEFAULT 0,
    SoLuongMuaVao INT DEFAULT 0,
    SoLuongBanRa INT DEFAULT 0,
    TonCuoi INT DEFAULT 0,
    PRIMARY KEY (Thang, Nam, MaSanPham),
    FOREIGN KEY (MaSanPham) REFERENCES SANPHAM(MaSanPham)
);

-- Accounts
CREATE TABLE TAIKHOAN (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenTaiKhoan VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'seller', 'warehouse') NOT NULL DEFAULT 'seller',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- INITIAL DATA
-- Accounts
INSERT INTO TaiKhoan (MaTaiKhoan, TenTaiKhoan, MatKhau, Role) VALUES
(1, 'admin', '123456', 'admin' ),
(2, 'thukho', '123456', 'warehouse'),
(3, 'seller', '123456', 'seller');

-- Customers
INSERT INTO KHACHHANG (MaKH, TenKH, SoDienThoai, DiaChi) VALUES
('KH01', N'Nguyễn Văn An', '0909111222', N'Quận 1'),
('KH02', N'Trần Thị Bích', '0909333444', N'Quận 3'),
('KH03', N'Lê Văn Cường', '0909555666', N'Quận 5'),
('KH04', N'Phạm Thị Dung', '0909777888', N'Quận 7'),
('KH05', N'Hoàng Văn Em', '0909999000', N'Quận 10'),
('KH06', N'Vũ Thị Mai', '0909123123', N'Bình Thạnh'),
('KH07', N'Đặng Văn Nam', '0909456456', N'Gò Vấp'),
('KH08', N'Bùi Thị Hoa', '0909789789', N'Tân Bình'),
('KH09', N'Ngô Văn Hùng', '0909321321', N'Thủ Đức'),
('KH10', N'Lý Thị Lan', '0909654654', N'Bình Tân');

-- Units
INSERT INTO DONVITINH (MaDVT, TenDVT) VALUES
('DVT01', N'Cái'), 
('DVT02', N'Chỉ'), 
('DVT03', N'Lượng'), 
('DVT04', N'Gram'),
('DVT05', N'Ly'), 
('DVT06', N'Carat'), 
('DVT07', N'Bộ'), 
('DVT08', N'Cặp'),
('DVT09', N'Viên'), 
('DVT10', N'Chuỗi');

-- Product categories
INSERT INTO LOAISANPHAM (MaLoaiSanPham, TenLoaiSanPham, MaDVT, PhanTramLoiNhuan) VALUES
('LSP01', N'Vàng 24K', 'DVT02', 0.10),
('LSP02', N'Vàng 18K', 'DVT02', 0.15),
('LSP03', N'Vàng Ý', 'DVT04', 0.20),
('LSP04', N'Bạc Cao Cấp', 'DVT04', 0.30),
('LSP05', N'Kim Cương', 'DVT05', 0.25),
('LSP06', N'Đá Quý', 'DVT06', 0.35),
('LSP07', N'Nhẫn Cưới', 'DVT08', 0.25),
('LSP08', N'Dây Chuyền', 'DVT10', 0.20),
('LSP09', N'Lắc Tay', 'DVT01', 0.20),
('LSP10', N'Bông Tai', 'DVT08', 0.25);

-- Products
INSERT INTO SANPHAM (MaSanPham, TenSanPham, MaLoaiSanPham, SoLuongTon, DonGiaMuaVao, DonGiaBanRa, HinhAnh) VALUES
('SP01', N'Nhẫn Vàng 24K Trơn 1 Chỉ', 'LSP01', 50, 5600000, 8000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604185/nh%E1%BA%ABn_1_ch%E1%BB%89_rzkjwy.png'),
('SP02', N'Nhẫn Cưới Kim Cương', 'LSP07', 20, 14000000, 20000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604186/nh%E1%BA%ABn_c%C6%B0%E1%BB%9Bi_kim_c%C6%B0%C6%A1ng_f7pomv.png'),
('SP03', N'Dây Chuyền Vàng Ý 18K', 'LSP03', 30, 3500000, 5000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604186/d%C3%A2y_chuy%E1%BB%81n_v%C3%A0ng_%C3%BD_bk8c8j.png'),
('SP04', N'Lắc Tay Bạc Charm', 'LSP04', 100, 700000, 1000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604185/l%E1%BA%AFc_tay_b%E1%BA%A1c_charm_ndswre.png'),
('SP05', N'Viên Kim Cương 5ly4', 'LSP05', 10, 21000000, 30000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604185/5ly4_mvclzj.png'),
('SP06', N'Bông Tai Ngọc Trai', 'LSP10', 40, 2100000, 3000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604184/b%C3%B4ng_tai_viryzu.png'),
('SP07', N'Vòng Cẩm Thạch', 'LSP06', 15, 5600000, 8000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604186/v%C3%B2ng_c%E1%BA%A9m_th%E1%BA%A1ch_eag5rf.png'),
('SP08', N'Kiềng Vàng 24K 5 Chỉ', 'LSP01', 10, 28000000, 40000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604186/ki%E1%BB%81ng_v%C3%A0ng_wavxbc.png'),
('SP09', N'Mặt Dây Chuyền Ruby', 'LSP06', 25, 4200000, 6000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604185/m%E1%BA%B7t_chuy%E1%BB%81n_v%C3%A0ng_doo9ns.png'),
('SP10', N'Nhẫn Nam Đá Đen', 'LSP02', 35, 2800000, 4000000, 'https://res.cloudinary.com/dfwvvjaxz/image/upload/v1765604187/nh%E1%BA%ABn_nam_knrpnh.png');

-- Suppliers
INSERT INTO NHACUNGCAP (MaNCC, TenNCC, DiaChi, SoDienThoai) VALUES
('NCC01', N'PNJ', N'Phú Nhuận, HCM', '02839951703'),
('NCC02', N'Doji', N'Hà Nội', '18001168'),
('NCC03', N'SJC', N'Quận 3, HCM', '02839293388'),
('NCC04', N'Bảo Tín Minh Châu', N'Hà Nội', '18006899'),
('NCC05', N'Thế Giới Kim Cương', N'Quận 1, HCM', '18007799'),
('NCC06', N'Tiệm Vàng Mi Hồng', N'Bình Thạnh, HCM', '02838410068'),
('NCC07', N'Swarovski VN', N'Quận 1, HCM', '02838212233'),
('NCC08', N'Pandora VN', N'Quận 7, HCM', '02854133333'),
('NCC09', N'Xưởng Gia Công Chợ Lớn', N'Quận 5, HCM', '0909123456'),
('NCC10', N'Ngọc Trai Phú Quốc', N'Kiên Giang', '0912345678');

-- Purchase orders
INSERT INTO PHIEUMUAHANG (SoPhieuMH, NgayLap, MaNCC, TongTien) VALUES
('PMH01', '2025-01-10 09:00:00', 'NCC01', 56000000), -- Mua SP01 (10 cái)
('PMH02', '2025-01-20 10:00:00', 'NCC02', 28000000), -- Mua SP02 (2 cái)
('PMH03', '2025-02-05 14:00:00', 'NCC03', 17500000), -- Mua SP03 (5 cái)
('PMH04', '2025-02-15 15:00:00', 'NCC04', 14000000), -- Mua SP04 (20 cái)
('PMH05', '2025-03-10 09:30:00', 'NCC05', 42000000), -- Mua SP05 (2 viên)
('PMH06', '2025-04-12 11:00:00', 'NCC06', 10500000), -- Mua SP06 (5 đôi)
('PMH07', '2025-05-20 16:00:00', 'NCC07', 16800000), -- Mua SP07 (3 chiếc)
('PMH08', '2025-06-15 08:30:00', 'NCC08', 56000000), -- Mua SP08 (2 cái)
('PMH09', '2025-07-22 13:00:00', 'NCC09', 21000000), -- Mua SP09 (5 cái)
('PMH10', '2025-08-08 10:00:00', 'NCC10', 14000000), -- Mua SP10 (5 cái)
('PMH11', '2025-09-05 09:00:00', 'NCC01', 28000000), -- Mua SP01 (5 cái)
('PMH12', '2025-09-20 14:00:00', 'NCC02', 42000000), -- Mua SP02 (3 cái)
('PMH13', '2025-10-10 11:00:00', 'NCC03', 35000000), -- Mua SP03 (10 cái)
('PMH14', '2025-11-02 15:30:00', 'NCC04', 7000000),  -- Mua SP04 (10 cái)
('PMH15', '2025-11-15 09:00:00', 'NCC05', 21000000); -- Mua SP05 (1 viên)

-- Purchase order details
INSERT INTO CHITIETMUAHANG (MaChiTietMH, SoPhieuMH, MaSanPham, SoLuongMua, DonGiaMua, ThanhTien) VALUES
('CTMH01', 'PMH01', 'SP01', 10, 5600000, 56000000),
('CTMH02', 'PMH02', 'SP02', 2, 14000000, 28000000),
('CTMH03', 'PMH03', 'SP03', 5, 3500000, 17500000),
('CTMH04', 'PMH04', 'SP04', 20, 700000, 14000000),
('CTMH05', 'PMH05', 'SP05', 2, 21000000, 42000000),
('CTMH06', 'PMH06', 'SP06', 5, 2100000, 10500000),
('CTMH07', 'PMH07', 'SP07', 3, 5600000, 16800000),
('CTMH08', 'PMH08', 'SP08', 2, 28000000, 56000000),
('CTMH09', 'PMH09', 'SP09', 5, 4200000, 21000000),
('CTMH10', 'PMH10', 'SP10', 5, 2800000, 14000000),
('CTMH11', 'PMH11', 'SP01', 5, 5600000, 28000000),
('CTMH12', 'PMH12', 'SP02', 3, 14000000, 42000000),
('CTMH13', 'PMH13', 'SP03', 10, 3500000, 35000000),
('CTMH14', 'PMH14', 'SP04', 10, 700000, 7000000),
('CTMH15', 'PMH15', 'SP05', 1, 21000000, 21000000);

-- Sales orders
INSERT INTO PHIEUBANHANG (SoPhieuBH, NgayLap, MaKH, TongTien) VALUES
('PBH01', '2025-01-15 10:00:00', 'KH01', 16000000), -- Bán SP01 (2 cái)
('PBH02', '2025-01-25 14:00:00', 'KH02', 20000000), -- Bán SP02 (1 cái)
('PBH03', '2025-02-14 18:00:00', 'KH03', 10000000), -- Bán SP03 (2 cái)
('PBH04', '2025-02-20 09:00:00', 'KH04', 5000000),  -- Bán SP04 (5 cái)
('PBH05', '2025-03-08 19:00:00', 'KH05', 30000000), -- Bán SP05 (1 cái)
('PBH06', '2025-04-15 10:00:00', 'KH06', 9000000),  -- Bán SP06 (3 cái)
('PBH07', '2025-05-25 15:00:00', 'KH07', 8000000),  -- Bán SP07 (1 cái)
('PBH08', '2025-06-20 11:00:00', 'KH08', 40000000), -- Bán SP08 (1 cái)
('PBH09', '2025-07-25 16:00:00', 'KH09', 12000000), -- Bán SP09 (2 cái)
('PBH10', '2025-08-10 09:00:00', 'KH10', 8000000),  -- Bán SP10 (2 cái)
('PBH11', '2025-09-10 14:00:00', 'KH01', 24000000), -- Bán SP01 (3 cái)
('PBH12', '2025-09-25 18:00:00', 'KH02', 40000000), -- Bán SP02 (2 cái)
('PBH13', '2025-10-15 10:00:00', 'KH03', 15000000), -- Bán SP03 (3 cái)
('PBH14', '2025-11-05 15:00:00', 'KH04', 3000000),  -- Bán SP04 (3 cái)
('PBH15', '2025-11-20 19:00:00', 'KH05', 60000000); -- Bán SP05 (2 cái)

-- Sales order details
INSERT INTO CHITIETBANHANG (MaChiTietBH, SoPhieuBH, MaSanPham, SoLuongBan, DonGiaBan, ThanhTien) VALUES
('CTBH01', 'PBH01', 'SP01', 2, 8000000, 16000000),
('CTBH02', 'PBH02', 'SP02', 1, 20000000, 20000000),
('CTBH03', 'PBH03', 'SP03', 2, 5000000, 10000000),
('CTBH04', 'PBH04', 'SP04', 5, 1000000, 5000000),
('CTBH05', 'PBH05', 'SP05', 1, 30000000, 30000000),
('CTBH06', 'PBH06', 'SP06', 3, 3000000, 9000000),
('CTBH07', 'PBH07', 'SP07', 1, 8000000, 8000000),
('CTBH08', 'PBH08', 'SP08', 1, 40000000, 40000000),
('CTBH09', 'PBH09', 'SP09', 2, 6000000, 12000000),
('CTBH10', 'PBH10', 'SP10', 2, 4000000, 8000000),
('CTBH11', 'PBH11', 'SP01', 3, 8000000, 24000000),
('CTBH12', 'PBH12', 'SP02', 2, 20000000, 40000000),
('CTBH13', 'PBH13', 'SP03', 3, 5000000, 15000000),
('CTBH14', 'PBH14', 'SP04', 3, 1000000, 3000000),
('CTBH15', 'PBH15', 'SP05', 2, 30000000, 60000000);

-- Service types
INSERT INTO LOAIDICHVU (MaLoaiDV, TenLoaiDV, DonGiaDV) VALUES
('LDV01', N'Đánh bóng làm mới', 50000),
('LDV02', N'Xi mạ vàng 18K', 200000),
('LDV03', N'Xi mạ vàng trắng', 250000),
('LDV04', N'Hàn dây chuyền', 100000),
('LDV05', N'Thu ni nhẫn', 150000),
('LDV06', N'Nới ni nhẫn', 150000),
('LDV07', N'Khắc chữ Laser', 100000),
('LDV08', N'Đính đá tấm', 50000),
('LDV09', N'Kiểm định đá quý', 500000),
('LDV10', N'Thiết kế theo yêu cầu', 2000000);

-- Service orders
INSERT INTO PHIEUDICHVU (SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang) VALUES
('PDV01', '2025-01-10 09:00:00', 'KH01', 50000, 50000, 0, N'Hoàn thành'),
('PDV02', '2025-02-15 10:00:00', 'KH02', 200000, 100000, 100000, N'Đang xử lý'),
('PDV03', '2025-03-20 11:00:00', 'KH03', 250000, 250000, 0, N'Hoàn thành'),
('PDV04', '2025-04-25 14:00:00', 'KH04', 100000, 50000, 50000, N'Đang xử lý'),
('PDV05', '2025-05-30 15:00:00', 'KH05', 150000, 150000, 0, N'Hoàn thành'),
('PDV06', '2025-06-05 09:00:00', 'KH06', 150000, 100000, 50000, N'Đang xử lý'),
('PDV07', '2025-07-10 10:00:00', 'KH07', 100000, 100000, 0, N'Hoàn thành'),
('PDV08', '2025-08-15 11:00:00', 'KH08', 50000, 50000, 0, N'Hoàn thành'),
('PDV09', '2025-09-20 14:00:00', 'KH09', 500000, 300000, 200000, N'Đang xử lý'),
('PDV10', '2025-10-25 15:00:00', 'KH10', 2000000, 1000000, 1000000, N'Chưa hoàn thành');

-- Chi tiết Phiếu dịch vụ
INSERT INTO CHITIETPHIEUDICHVU (MaChiTietDV, SoPhieuDV, MaLoaiDV, DonGiaDuocTinh, SoLuong, ThanhTien, TraTruoc, ConLai, NgayGiao, TinhTrang) VALUES
('CTDV01', 'PDV01', 'LDV01', 50000, 1, 50000, 50000, 0, '2025-01-11', N'Đã giao'),
('CTDV02', 'PDV02', 'LDV02', 200000, 1, 200000, 100000, 100000, NULL, N'Đang xi mạ'),
('CTDV03', 'PDV03', 'LDV03', 250000, 1, 250000, 250000, 0, '2025-03-22', N'Đã giao'),
('CTDV04', 'PDV04', 'LDV04', 100000, 1, 100000, 50000, 50000, NULL, N'Đang hàn'),
('CTDV05', 'PDV05', 'LDV05', 150000, 1, 150000, 150000, 0, '2025-05-31', N'Đã giao'),
('CTDV06', 'PDV06', 'LDV06', 150000, 1, 150000, 100000, 50000, NULL, N'Đang sửa'),
('CTDV07', 'PDV07', 'LDV07', 100000, 1, 100000, 100000, 0, '2025-07-11', N'Đã giao'),
('CTDV08', 'PDV08', 'LDV08', 50000, 1, 50000, 50000, 0, '2025-08-16', N'Đã giao'),
('CTDV09', 'PDV09', 'LDV09', 500000, 1, 500000, 300000, 200000, NULL, N'Đang kiểm định'),
('CTDV10', 'PDV10', 'LDV10', 2000000, 1, 2000000, 1000000, 1000000, NULL, N'Đang thiết kế');

-- Báo cáo tồn kho
INSERT INTO BAOCAOTONKHO (Thang, Nam, MaSanPham, TonDau, SoLuongMuaVao, SoLuongBanRa, TonCuoi) VALUES
(1, 2025, 'SP01', 50, 10, 2, 58),  
(1, 2025, 'SP02', 20, 2, 1, 21),   
(1, 2025, 'SP03', 30, 0, 5, 25),   
(1, 2025, 'SP04', 100, 0, 10, 90), 
(1, 2025, 'SP05', 10, 0, 0, 10),  
(1, 2025, 'SP06', 40, 0, 2, 38),   
(2, 2025, 'SP03', 25, 5, 2, 28),   
(2, 2025, 'SP04', 90, 20, 15, 95), 
(2, 2025, 'SP01', 58, 0, 10, 48),  
(2, 2025, 'SP02', 21, 0, 5, 16),  
(2, 2025, 'SP07', 15, 0, 2, 13),  
(2, 2025, 'SP08', 10, 0, 1, 9),    
(3, 2025, 'SP05', 10, 2, 1, 11),   
(3, 2025, 'SP06', 38, 0, 8, 30),   
(3, 2025, 'SP09', 25, 0, 3, 22),   
(3, 2025, 'SP10', 35, 0, 2, 33),  
(3, 2025, 'SP03', 28, 0, 3, 25),
(3, 2025, 'SP04', 95, 0, 5, 90),
(4, 2025, 'SP06', 30, 5, 2, 33),
(4, 2025, 'SP01', 48, 0, 3, 45),
(4, 2025, 'SP02', 16, 0, 1, 15),
(4, 2025, 'SP05', 11, 0, 0, 11),
(4, 2025, 'SP07', 13, 0, 1, 12),
(4, 2025, 'SP08', 9, 0, 0, 9),
(5, 2025, 'SP07', 12, 3, 2, 13),
(5, 2025, 'SP09', 22, 0, 2, 20),
(5, 2025, 'SP10', 33, 0, 3, 30),
(5, 2025, 'SP01', 45, 0, 5, 40),
(5, 2025, 'SP02', 15, 0, 4, 11),
(5, 2025, 'SP03', 25, 0, 2, 23),
(6, 2025, 'SP08', 9, 2, 1, 10),
(6, 2025, 'SP04', 90, 0, 8, 82),
(6, 2025, 'SP05', 11, 0, 1, 10),
(6, 2025, 'SP06', 33, 0, 3, 30),
(6, 2025, 'SP09', 20, 0, 1, 19),
(6, 2025, 'SP10', 30, 0, 2, 28),
(7, 2025, 'SP09', 19, 5, 2, 22),
(7, 2025, 'SP01', 40, 0, 2, 38),
(7, 2025, 'SP03', 23, 0, 3, 20),
(7, 2025, 'SP04', 82, 0, 5, 77),
(7, 2025, 'SP07', 13, 0, 1, 12),
(7, 2025, 'SP02', 11, 0, 1, 10),
(8, 2025, 'SP10', 28, 5, 3, 30),
(8, 2025, 'SP05', 10, 0, 1, 9),
(8, 2025, 'SP06', 30, 0, 2, 28),
(8, 2025, 'SP08', 10, 0, 1, 9),
(8, 2025, 'SP01', 38, 0, 4, 34),
(8, 2025, 'SP02', 10, 0, 2, 8),
(9, 2025, 'SP01', 34, 5, 3, 36),
(9, 2025, 'SP02', 8, 3, 2, 9),
(9, 2025, 'SP03', 20, 0, 2, 18),
(9, 2025, 'SP04', 77, 0, 4, 73),
(9, 2025, 'SP07', 12, 0, 1, 11),
(9, 2025, 'SP09', 22, 0, 3, 19),
(10, 2025, 'SP03', 18, 10, 3, 25),
(10, 2025, 'SP05', 9, 0, 1, 8),
(10, 2025, 'SP06', 28, 0, 3, 25),
(10, 2025, 'SP08', 9, 0, 1, 8),
(10, 2025, 'SP10', 30, 0, 2, 28),
(10, 2025, 'SP04', 73, 0, 5, 68),
(11, 2025, 'SP04', 68, 10, 8, 70),
(11, 2025, 'SP05', 8, 1, 2, 7),
(11, 2025, 'SP01', 36, 0, 6, 30),
(11, 2025, 'SP02', 9, 0, 3, 6),
(11, 2025, 'SP07', 11, 0, 2, 9),
(11, 2025, 'SP09', 19, 0, 2, 17);