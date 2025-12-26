import { connection } from "../config/connectDB.js";

const checkStockAvailability = async (items) => {
  if (!items || items.length === 0) return;

  for (const item of items) {
    const maSP = item.MaSanPham;
    const soLuongMua = Number(item.SoLuongBan) || 0;

    // Lấy số lượng tồn hiện tại trong DB
    const [rows] = await connection.execute(
      "SELECT TenSanPham, SoLuongTon FROM sanpham WHERE MaSanPham = ?",
      [maSP]
    );

    if (rows.length === 0) {
      throw new Error(`Sản phẩm ${maSP} không tồn tại`);
    }

    const currentStock = Number(rows[0].SoLuongTon) || 0;

    // Nếu mua nhiều hơn tồn -> Báo lỗi ngay lập tức
    if (soLuongMua > currentStock) {
      const err = new Error(
        `Sản phẩm "${rows[0].TenSanPham}" chỉ còn tồn ${currentStock}, không đủ để bán ${soLuongMua}`
      );
      err.code = "OUT_OF_STOCK"; // Gắn code để Frontend dễ xử lý
      throw err;
    }
  }
};

const InvoiceModel = {
  getAllInvoices: async (search) => {
    try {
      let query = `
       SELECT 
            pb.SoPhieuBH, 
            pb.NgayLap, 
            pb.MaKH, 
            kh.TenKH,
            COALESCE(SUM(ct.SoLuongBan * sp.DonGiaBanRa), 0) as TongTien
        FROM phieubanhang pb
        LEFT JOIN khachhang kh ON pb.MaKH = kh.MaKH
        LEFT JOIN chitietbanhang ct ON pb.SoPhieuBH = ct.SoPhieuBH
        LEFT JOIN sanpham sp ON ct.MaSanPham = sp.MaSanPham
      `;

      const groupBy = ` GROUP BY pb.SoPhieuBH, pb.NgayLap, pb.MaKH, kh.TenKH`;
      const order = ` ORDER BY pb.NgayLap DESC`;

      if (search) {
        const q = `%${search}%`;
        query += ` WHERE pb.SoPhieuBH LIKE ? OR kh.TenKH LIKE ?`;
        query += groupBy + order;
        const [rows] = await connection.execute(query, [q, q]);
        return rows;
      }

      query += groupBy + order;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getInvoiceById: async (soPhieu) => {
    try {
      const [invoices] = await connection.execute(
        `SELECT pb.*, kh.TenKH, kh.DiaChi, kh.SoDienThoai 
         FROM phieubanhang pb 
         LEFT JOIN khachhang kh ON pb.MaKH = kh.MaKH 
         WHERE pb.SoPhieuBH = ?`,
        [soPhieu]
      );

      const [items] = await connection.execute(
        `SELECT ct.*, 
                sp.TenSanPham, 
                sp.HinhAnh, 
                sp.DonGiaBanRa, -- Lấy giá bán hiện tại từ bảng SP
                lsp.TenLoaiSanPham, 
                dvt.TenDVT 
         FROM chitietbanhang ct 
         LEFT JOIN sanpham sp ON ct.MaSanPham = sp.MaSanPham
         LEFT JOIN loaisanpham lsp ON sp.MaLoaiSanPham = lsp.MaLoaiSanPham
         LEFT JOIN donvitinh dvt ON lsp.MaDVT = dvt.MaDVT
         WHERE ct.SoPhieuBH = ?`,
        [soPhieu]
      );

      const invoice = invoices[0] || null;

      // Tính lại tổng tiền
      if (invoice && items) {
        const calculatedTotal = items.reduce((sum, item) => {
          return sum + Number(item.SoLuongBan) * Number(item.DonGiaBan);
        }, 0);
        invoice.TongTien = calculatedTotal;
      }

      return { invoice, items };
    } catch (error) {
      throw error;
    }
  },
  createInvoice: async (data) => {
    try {
      const { SoPhieuBH, NgayLap, MaKH, TongTien, items } = data;
      //Kiểm tra tồn kho
      await checkStockAvailability(items);
      // check duplicate SoPhieuBH
      const [dups] = await connection.execute(
        `SELECT 1 FROM phieubanhang WHERE SoPhieuBH = ? LIMIT 1`,
        [SoPhieuBH]
      );
      if (dups && dups.length > 0) {
        const err = new Error("DUPLICATE_INVOICE");
        err.code = "DUPLICATE_INVOICE";
        throw err;
      }
      // Insert invoice
      await connection.query(
        `INSERT INTO phieubanhang (SoPhieuBH, NgayLap, MaKH, TongTien) VALUES (?, ?, ?, ?)`,
        [SoPhieuBH, NgayLap || new Date(), MaKH, TongTien || 0]
      );
      // Insert items
      if (items && items.length > 0) {
        const insertQuery = `INSERT INTO chitietbanhang (MaChiTietBH, SoPhieuBH, MaSanPham, SoLuongBan, DonGiaBan, ThanhTien) VALUES ?`;
        const values = items.map((it) => [
          it.MaChiTietBH ||
            `CT${Date.now()}${Math.floor(Math.random() * 1000)}`,
          SoPhieuBH,
          it.MaSanPham,
          it.SoLuongBan || 0,
          it.DonGiaBan || 0,
          it.ThanhTien || 0,
        ]);
        await connection.query(insertQuery, [values]);
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteInvoices: async (ids) => {
    if (!ids || ids.length === 0) return 0;
    try {
      const placeholders = ids.map(() => "?").join(",");
      // delete details first
      await connection.query(
        `DELETE FROM chitietbanhang WHERE SoPhieuBH IN (${placeholders})`,
        ids
      );
      const [result] = await connection.query(
        `DELETE FROM phieubanhang WHERE SoPhieuBH IN (${placeholders})`,
        ids
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

export default InvoiceModel;
