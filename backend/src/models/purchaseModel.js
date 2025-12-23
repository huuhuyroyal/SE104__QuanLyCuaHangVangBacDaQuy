import { connection } from "../config/connectDB.js";

const PurchaseModel = {
  getAllPurchases: async (search) => {
    const baseSql = `
      SELECT pmh.*, ncc.TenNCC
      FROM phieumuahang pmh
      LEFT JOIN nhacungcap ncc ON pmh.MaNCC = ncc.MaNCC
    `;
    const order = " ORDER BY pmh.NgayLap DESC";
    if (search) {
      const q = `%${search}%`;
      const [rows] = await connection.execute(
        `${baseSql} WHERE pmh.SoPhieuMH LIKE ? OR ncc.TenNCC LIKE ? ${order}`,
        [q, q]
      );
      return rows;
    }
    const [rows] = await connection.execute(`${baseSql} ${order}`);
    return rows;
  },

  getPurchaseById: async (soPhieu) => {
    const [rows] = await connection.execute(
      `SELECT pmh.*, ncc.TenNCC, ncc.DiaChi, ncc.SoDienThoai FROM phieumuahang pmh LEFT JOIN nhacungcap ncc ON pmh.MaNCC = ncc.MaNCC WHERE pmh.SoPhieuMH = ?`,
      [soPhieu]
    );
    const [items] = await connection.execute(
      `SELECT ct.*, sp.TenSanPham, sp.HinhAnh, lsp.TenLoaiSanPham, dvt.TenDVT
       FROM chitietmuahang ct 
       LEFT JOIN sanpham sp ON ct.MaSanPham = sp.MaSanPham
       LEFT JOIN loaisanpham lsp ON sp.MaLoaiSanPham = lsp.MaLoaiSanPham
       LEFT JOIN donvitinh dvt ON lsp.MaDVT = dvt.MaDVT
       WHERE ct.SoPhieuMH = ?`,
      [soPhieu]
    );
    return { purchase: rows[0] || null, items };
  },

  createPurchase: async (data) => {
    const { SoPhieuMH, NgayLap, MaNCC, TongTien, items } = data;
    // duplicate check
    const [dups] = await connection.execute(
      `SELECT 1 FROM phieumuahang WHERE SoPhieuMH = ? LIMIT 1`,
      [SoPhieuMH]
    );
    if (dups && dups.length > 0) {
      const err = new Error("DUPLICATE_PURCHASE");
      err.code = "DUPLICATE_PURCHASE";
      throw err;
    }
    await connection.query(
      `INSERT INTO phieumuahang (SoPhieuMH, NgayLap, MaNCC, TongTien) VALUES (?, ?, ?, ?)`,
      [SoPhieuMH, NgayLap || new Date(), MaNCC, TongTien || 0]
    );
    // Insert items
    if (items && items.length > 0) {
      const insertQuery = `INSERT INTO chitietmuahang (MaChiTietMH, SoPhieuMH, MaSanPham, SoLuongMua, DonGiaMua, ThanhTien) VALUES ?`;
      const values = items.map((it) => [
        it.MaChiTietMH || `CTMH${Date.now()}${Math.floor(Math.random() * 1000)}`,
        SoPhieuMH,
        it.MaSanPham,
        it.SoLuongMua || 0,
        it.DonGiaMua || 0,
        it.ThanhTien || 0,
      ]);
      await connection.query(insertQuery, [values]);
    }
    return true;
  },

  updatePurchase: async (data) => {
    const { SoPhieuMH, NgayLap, MaNCC, TongTien, items } = data;
    await connection.query(
      `UPDATE phieumuahang SET NgayLap = ?, MaNCC = ?, TongTien = ? WHERE SoPhieuMH = ?`,
      [NgayLap || new Date(), MaNCC, TongTien || 0, SoPhieuMH]
    );
    // Replace items: delete old and insert new
    await connection.query(`DELETE FROM chitietmuahang WHERE SoPhieuMH = ?`, [SoPhieuMH]);
    if (items && items.length > 0) {
      const insertQuery = `INSERT INTO chitietmuahang (MaChiTietMH, SoPhieuMH, MaSanPham, SoLuongMua, DonGiaMua, ThanhTien) VALUES ?`;
      const values = items.map((it) => [
        it.MaChiTietMH || `CTMH${Date.now()}${Math.floor(Math.random() * 1000)}`,
        SoPhieuMH,
        it.MaSanPham,
        it.SoLuongMua || 0,
        it.DonGiaMua || 0,
        it.ThanhTien || 0,
      ]);
      await connection.query(insertQuery, [values]);
    }
    return true;
  },

  deletePurchases: async (ids) => {
    if (!ids || ids.length === 0) return 0;
    const placeholders = ids.map(() => "?").join(",");
    // delete details first
    await connection.query(`DELETE FROM chitietmuahang WHERE SoPhieuMH IN (${placeholders})`, ids);
    const [result] = await connection.query(
      `DELETE FROM phieumuahang WHERE SoPhieuMH IN (${placeholders})`,
      ids
    );
    return result.affectedRows;
  },
};

export default PurchaseModel;
