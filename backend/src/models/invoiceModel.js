import { connection } from "../config/connectDB.js";

const InvoiceModel = {
  getAllInvoices: async (search) => {
    try {
      if (search) {
        const q = `%${search}%`;
        const query = `
          SELECT pb.*, kh.TenKH
          FROM phieubanhang pb
          LEFT JOIN khachhang kh ON pb.MaKH = kh.MaKH
          WHERE pb.SoPhieuBH LIKE ? OR kh.TenKH LIKE ?
          ORDER BY pb.NgayLap DESC
        `;
        const [rows] = await connection.execute(query, [q, q]);
        return rows;
      }
      const query = `
        SELECT pb.*, kh.TenKH
        FROM phieubanhang pb
        LEFT JOIN khachhang kh ON pb.MaKH = kh.MaKH
        ORDER BY pb.NgayLap DESC
      `;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getInvoiceById: async (soPhieu) => {
    try {
      const [invoices] = await connection.execute(
        `SELECT pb.*, kh.TenKH FROM phieubanhang pb LEFT JOIN khachhang kh ON pb.MaKH = kh.MaKH WHERE pb.SoPhieuBH = ?`,
        [soPhieu]
      );
      const [items] = await connection.execute(
        `SELECT ct.*, sp.TenSanPham, sp.HinhAnh, lsp.TenLoaiSanPham, dvt.TenDVT 
         FROM chitietbanhang ct 
         LEFT JOIN sanpham sp ON ct.MaSanPham = sp.MaSanPham
         LEFT JOIN loaisanpham lsp ON sp.MaLoaiSanPham = lsp.MaLoaiSanPham
         LEFT JOIN donvitinh dvt ON lsp.MaDVT = dvt.MaDVT
         WHERE ct.SoPhieuBH = ?`,
        [soPhieu]
      );
      return { invoice: invoices[0] || null, items };
    } catch (error) {
      throw error;
    }
  },
  createInvoice: async (data) => {
    try {
      const { SoPhieuBH, NgayLap, MaKH, TongTien, items } = data;
      // check duplicate SoPhieuBH
      const [dups] = await connection.execute(
        `SELECT 1 FROM phieubanhang WHERE SoPhieuBH = ? LIMIT 1`,
        [SoPhieuBH]
      );
      if (dups && dups.length > 0) {
        const err = new Error('DUPLICATE_INVOICE');
        err.code = 'DUPLICATE_INVOICE';
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
        const values = items.map((it) => [it.MaChiTietBH || `CT${Date.now()}${Math.floor(Math.random()*1000)}`, SoPhieuBH, it.MaSanPham, it.SoLuongBan || 0, it.DonGiaBan || 0, it.ThanhTien || 0]);
        await connection.query(insertQuery, [values]);
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateInvoice: async (data) => {
    try {
      const { SoPhieuBH, NgayLap, MaKH, TongTien, items } = data;
      await connection.query(
        `UPDATE phieubanhang SET NgayLap = ?, MaKH = ?, TongTien = ? WHERE SoPhieuBH = ?`,
        [NgayLap || new Date(), MaKH, TongTien || 0, SoPhieuBH]
      );
      // Replace items: delete old and insert new
      await connection.query(`DELETE FROM chitietbanhang WHERE SoPhieuBH = ?`, [SoPhieuBH]);
      if (items && items.length > 0) {
        const insertQuery = `INSERT INTO chitietbanhang (MaChiTietBH, SoPhieuBH, MaSanPham, SoLuongBan, DonGiaBan, ThanhTien) VALUES ?`;
        const values = items.map((it) => [it.MaChiTietBH || `CT${Date.now()}${Math.floor(Math.random()*1000)}`, SoPhieuBH, it.MaSanPham, it.SoLuongBan || 0, it.DonGiaBan || 0, it.ThanhTien || 0]);
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
      await connection.query(`DELETE FROM chitietbanhang WHERE SoPhieuBH IN (${placeholders})`, ids);
      const [result] = await connection.query(`DELETE FROM phieubanhang WHERE SoPhieuBH IN (${placeholders})`, ids);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

export default InvoiceModel;
