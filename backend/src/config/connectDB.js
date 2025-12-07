import mysql from "mysql2/promise";

// Tạo pool kết nối
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "qlbh",
});

// Hàm kiểm tra kết nối
const connectDB = async () => {
  try {
    await connection.getConnection();
    console.log("Kết nối Database qlbh thành công!");
  } catch (error) {
    console.error("Kết nối thất bại:", error.message);
  }
};
export { connection, connectDB };
