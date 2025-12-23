import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// Create a connection pool using environment variables
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "qlbh",
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONN_LIMIT) || 10,
});

// Function to check DB connection
const connectDB = async () => {
  try {
    const conn = await connection.getConnection();
    conn.release();
    console.log("Kết nối Database qlbh thành công!");
  } catch (error) {
    console.error("Kết nối thất bại:", error.message);
    // Exit process if DB connection fails
    process.exit(1);
  }
};
export { connection, connectDB };
 
