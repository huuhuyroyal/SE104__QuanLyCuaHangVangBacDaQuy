// backend/src/models/unitModel.js
import { connection } from "../config/connectDB.js";

const UnitModel = {
  getAll: async () => {
    const [rows] = await connection.query(
      "SELECT MaDVT, TenDVT FROM donvitinh"
    );
    return rows;
  },
};

export default UnitModel;
