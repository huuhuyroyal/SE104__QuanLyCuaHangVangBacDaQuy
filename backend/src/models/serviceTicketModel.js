import { connection } from "../config/connectDB.js";

const ServiceTicketModel = {
  // Get all tickets
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

  // Get ticket by ID with details
  getById: async (id) => {
    try {
      // Get Header
      const [header] = await connection.execute(
        `SELECT p.*, k.TenKH, k.SoDienThoai, k.DiaChi 
         FROM PHIEUDICHVU p
         LEFT JOIN KHACHHANG k ON p.MaKH = k.MaKH
         WHERE p.SoPhieuDV = ?`, 
        [id]
      );

      // Get Details
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

  // Create new ticket
  create: async (data) => {
    try {
      const { SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang, items } = data;

      // Check duplicate ID
      const [dup] = await connection.execute("SELECT 1 FROM PHIEUDICHVU WHERE SoPhieuDV = ?", [SoPhieuDV]);
      if (dup.length > 0) throw { code: "DUPLICATE_ID" };

      // Insert Header
      await connection.query(
        `INSERT INTO PHIEUDICHVU (SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [SoPhieuDV, NgayLap, MaKH, TongTien, TongTienTraTruoc, TongTienConLai, TinhTrang || 'Đang xử lý']
      );

      // Insert Details
      if (items && items.length > 0) {
        const values = items.map(it => [
            it.MaChiTietDV || `CTDV${Date.now()}${Math.floor(Math.random()*100)}`,
            SoPhieuDV,
            it.MaLoaiDV,
            it.SoLuong,
            it.DonGiaDuocTinh,
            it.ThanhTien,
            it.ThanhTienTraTruoc
        ]);
        
        const sql = `INSERT INTO CHITIETPHIEUDICHVU (MaChiTietDV, SoPhieuDV, MaLoaiDV, SoLuong, DonGiaDuocTinh, ThanhTien, ThanhTienTraTruoc) VALUES ?`;
        await connection.query(sql, [values]);
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Update status (Simple update for workflow)
  updateStatus: async (id, status) => {
    try {
        await connection.query("UPDATE PHIEUDICHVU SET TinhTrang = ? WHERE SoPhieuDV = ?", [status, id]);
        return true;
    } catch (error) {
        throw error;
    }
  },

  // Delete
  delete: async (ids) => {
    try {
        if (!ids || ids.length === 0) return;
        const placeholders = ids.map(() => "?").join(",");
        
        // Delete details first (Handled by FK Cascade usually, but good to be safe)
        await connection.query(`DELETE FROM CHITIETPHIEUDICHVU WHERE SoPhieuDV IN (${placeholders})`, ids);
        // Delete header
        const [res] = await connection.query(`DELETE FROM PHIEUDICHVU WHERE SoPhieuDV IN (${placeholders})`, ids);
        return res.affectedRows;
    } catch (error) {
        throw error;
    }
  }
};

export default ServiceTicketModel;