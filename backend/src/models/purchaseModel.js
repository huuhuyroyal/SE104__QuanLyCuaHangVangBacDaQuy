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
        it.MaChiTietMH ||
          `CTMH${Date.now()}${Math.floor(Math.random() * 1000)}`,
        SoPhieuMH,
        it.MaSanPham,
        it.SoLuongMua || 0,
        it.DonGiaMua || 0,
        it.ThanhTien || 0,
      ]);
      await connection.query(insertQuery, [values]);
      for (const item of items) {
        // Lấy Phần trăm lợi nhuận từ bảng Loại Sản Phẩm
        const [typeRows] = await connection.execute(
          `SELECT lsp.PhanTramLoiNhuan 
           FROM sanpham sp 
           JOIN loaisanpham lsp ON sp.MaLoaiSanPham = lsp.MaLoaiSanPham 
           WHERE sp.MaSanPham = ?`,
          [item.MaSanPham]
        );

        // Mặc định là 0 nếu không tìm thấy
        const profitPercent =
          typeRows[0] && typeRows[0].PhanTramLoiNhuan
            ? typeRows[0].PhanTramLoiNhuan
            : 0;

        // Tính giá bán mới
        const importPrice = Number(item.DonGiaMua);
        const newSellingPrice =
          importPrice + (importPrice * profitPercent) / 100;

        // Cập nhật vào bảng Sản Phẩm
        await connection.execute(
          `
          UPDATE sanpham 
          SET 
            SoLuongTon = SoLuongTon + ?, 
            DonGiaMuaVao = ?,
            DonGiaBanRa = ?
          WHERE MaSanPham = ?
        `,
          [item.SoLuongMua, importPrice, newSellingPrice, item.MaSanPham]
        );
      }
    }
    return true;
  },

  deletePurchases: async (ids) => {
    if (!ids || ids.length === 0) return 0;
    const placeholders = ids.map(() => "?").join(",");
    try {
      //Lấy danh sách sản phẩm trong các phiếu sắp xóa
      const [itemsToDelete] = await connection.query(
        `SELECT MaSanPham, SoLuongMua FROM chitietmuahang WHERE SoPhieuMH IN (${placeholders})`,
        ids
      );

      //Hoàn tác số lượng tồn kho
      if (itemsToDelete && itemsToDelete.length > 0) {
        for (const item of itemsToDelete) {
          await connection.execute(
            `UPDATE sanpham SET SoLuongTon = SoLuongTon - ? WHERE MaSanPham = ?`,
            [item.SoLuongMua, item.MaSanPham]
          );
        }
      }
      // delete details first
      await connection.query(
        `DELETE FROM chitietmuahang WHERE SoPhieuMH IN (${placeholders})`,
        ids
      );
      const [result] = await connection.query(
        `DELETE FROM phieumuahang WHERE SoPhieuMH IN (${placeholders})`,
        ids
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

export default PurchaseModel;
