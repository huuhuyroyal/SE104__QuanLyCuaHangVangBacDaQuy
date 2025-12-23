import { connection } from "../config/connectDB.js";

const ServiceTicketModel = {
  // ... existing getAll and getById methods ...
  getAll: async (search) => {
    try {
      let query = `
        SELECT p.*, k.TenKH 
        FROM PHIEUDICHVU p
        LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
      `;
      if (search) {
        query += ` WHERE p.SoPhieuDV LIKE '%${search}%' OR k.TenKH LIKE '%${search}%'`;
      }
      query += ` ORDER BY p.NgayLap DESC`;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [header] = await connection.execute(
        `SELECT p.*, k.TenKH, k.SoDienThoai, k.DiaChi 
         FROM PHIEUDICHVU p
         LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
         WHERE p.SoPhieuDV = ?`, 
        [id]
      );

      const [details] = await connection.execute(
        `SELECT ct.*, l.TenLoaiDV, l.DonGiaDV
         FROM CHITIETPHIEUDICHVU ct
         LEFT JOIN LOAIDICHVU l ON ct.MaLoaiDV = l.MaLoaiDV
         WHERE ct.SoPhieuDV = ?`,
        [id]
      );
      return { ticket: header[0], items: details };
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    const conn = await connection.getConnection();
    try {
      const { SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang, items } = data;

      await conn.beginTransaction();

      const [dup] = await conn.execute("SELECT 1 FROM PHIEUDICHVU WHERE SoPhieuDV = ?", [SoPhieuDV]);
      if (dup.length > 0) {
        throw { code: "DUPLICATE_ID" };
      }

      if (!items || items.length === 0) {
        throw new Error("NO_ITEMS");
      }

      await conn.query(
        `INSERT INTO PHIEUDICHVU (SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang || 'Đang xử lý']
      );

      const values = items.map(it => [
          it.MaChiTietDV || `CTDV${Date.now()}${Math.floor(Math.random()*100)}`,
          SoPhieuDV,
          it.MaLoaiDV,
          it.SoLuong,
          it.DonGiaDuocTinh,
          it.ThanhTien,
          it.TraTruoc
      ]);
      
      const sql = `INSERT INTO CHITIETPHIEUDICHVU (MaChiTietDV, SoPhieuDV, MaLoaiDV, SoLuong, DonGiaDuocTinh, ThanhTien, TraTruoc) VALUES ?`;
      await conn.query(sql, [values]);

      await conn.commit();
      return true;

    } catch (error) {
      await conn.rollback();
      throw error; 
    } finally {
      conn.release();
    }
  },

  updateStatus: async (id, status) => {
    try {
        await connection.query("UPDATE PHIEUDICHVU SET TinhTrang = ? WHERE SoPhieuDV = ?", [status, id]);
        return true;
    } catch (error) {
        throw error;
    }
  },

  delete: async (ids) => {
    try {
        if (!ids || ids.length === 0) return;
        const placeholders = ids.map(() => "?").join(",");
        await connection.query(`DELETE FROM CHITIETPHIEUDICHVU WHERE SoPhieuDV IN (${placeholders})`, ids);
        const [res] = await connection.query(`DELETE FROM PHIEUDICHVU WHERE SoPhieuDV IN (${placeholders})`, ids);
        return res.affectedRows;
    } catch (error) {
        throw error;
    }
  }
};

export default ServiceTicketModel;