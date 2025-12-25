import { connection } from "../config/connectDB.js";

const profileModel = {
  getAllProfiles: async () => {
    const [rows] = await connection.execute(
      "SELECT * FROM TAIKHOAN ORDER BY TenTaikhoan ASC"
    );
    return rows;
  },

  checkProfileExist: async (profilename) => {
    const [rows] = await connection.execute(
      "SELECT * FROM TAIKHOAN WHERE TenTaikhoan = ?",
      [profilename]
    );
    return rows.length > 0;
  },

  getProfileByProfilename: async (profilename) => {
    const [rows] = await connection.execute(
      "SELECT * FROM TAIKHOAN WHERE TenTaikhoan = ?",
      [profilename]
    );
    return rows[0];
  },

  updatePassword: async (profilename, newPassword) => {
    await connection.execute(
      "UPDATE TAIKHOAN SET MatKhau = ? WHERE TenTaikhoan = ?",
      [newPassword, profilename]
    );
  },
};

export default profileModel;
