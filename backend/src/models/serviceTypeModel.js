import { connection } from "../config/connectDB.js";

const ServiceTypeModel = {
  // Get all records
  getAll: async () => {
    try {
      // We explicitly select only the columns we care about
      const query = "SELECT MaLoaiDV, TenLoaiDV, DonGiaDV, PhanTramTraTruoc FROM LOAIDICHVU ORDER BY MaLoaiDV ASC";
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Create new record
  create: async (data) => {
    try {
      const query = `
        INSERT INTO LOAIDICHVU (MaLoaiDV, TenLoaiDV, DonGiaDV, PhanTramTraTruoc) 
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await connection.query(query, [
        data.MaLoaiDV, 
        data.TenLoaiDV, 
        data.DonGiaDV || 0, 
        data.PhanTramTraTruoc || 0
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Update existing record
  update: async (data) => {
    try {
      const query = `
        UPDATE LOAIDICHVU 
        SET TenLoaiDV = ?, DonGiaDV = ?, PhanTramTraTruoc = ? 
        WHERE MaLoaiDV = ?
      `;
      const [result] = await connection.query(query, [
        data.TenLoaiDV, 
        data.DonGiaDV, 
        data.PhanTramTraTruoc, 
        data.MaLoaiDV
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Delete record
  delete: async (id) => {
    try {
      const query = "DELETE FROM LOAIDICHVU WHERE MaLoaiDV = ?";
      const [result] = await connection.query(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default ServiceTypeModel;