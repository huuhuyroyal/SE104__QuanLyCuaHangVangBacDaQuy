import { connection } from "../config/connectDB.js";

const SupplierModel = {
  getAllSuppliers: async () => {
    const [rows] = await connection.execute(
      `SELECT MaNCC, TenNCC, DiaChi, SoDienThoai FROM nhacungcap ORDER BY TenNCC`
    );
    return rows;
  },
};

export default SupplierModel;
