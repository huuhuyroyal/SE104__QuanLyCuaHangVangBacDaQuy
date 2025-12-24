import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/database.js';
import Customer from '../models/customerModel.js';

class CustomerService {
    // Lấy thông tin chi tiết kèm thống kê từ SQL
    static async getCustomerById(id) {
        // Query lấy thông tin khách hàng kèm tổng chi tiêu và số đơn
        const [results] = await sequelize.query(`
            SELECT 
                kh.*,
                (SELECT SUM(TongTien) FROM PHIEUBANHANG WHERE MaKH = kh.MaKH) as TongChiTieu,
                (SELECT COUNT(*) FROM PHIEUBANHANG WHERE MaKH = kh.MaKH) as SoLuongDonHang
            FROM KHACHHANG kh
            WHERE kh.MaKH = :id
        `, { replacements: { id } });

        if (!results.length) throw new Error('Khách hàng không tồn tại');

        // Lấy lịch sử mua hàng
        const [history] = await sequelize.query(`
            SELECT 
                pbh.SoPhieuBH as id,
                pbh.NgayLap as date,
                pbh.TongTien as total,
                GROUP_CONCAT(CONCAT(sp.TenSanPham, ' x', ctbh.SoLuongBan) SEPARATOR ', ') as product_summary
            FROM PHIEUBANHANG pbh
            JOIN CHITIETBANHANG ctbh ON pbh.SoPhieuBH = ctbh.SoPhieuBH
            JOIN SANPHAM sp ON ctbh.MaSanPham = sp.MaSanPham
            WHERE pbh.MaKH = :id
            GROUP BY pbh.SoPhieuBH
            ORDER BY pbh.NgayLap DESC
        `, { replacements: { id } });

        return { ...results[0], orderHistory: history };
    }

    static async createCustomer(data) {
        const customerData = {
            ...data,
            MaKH: `KH${uuidv4().substring(0, 8).toUpperCase()}`
        };
        return await Customer.create(customerData);
    }

    static async deleteCustomer(id) {
        const t = await sequelize.transaction();
        try {
            // Xóa theo thứ tự bảng con trước (Ràng buộc khóa ngoại)
            await sequelize.query(`DELETE FROM CHITIETPHIEUDICHVU WHERE SoPhieuDV IN (SELECT SoPhieuDV FROM PHIEUDICHVU WHERE MaKH = '${id}')`, { transaction: t });
            await sequelize.query(`DELETE FROM PHIEUDICHVU WHERE MaKH = '${id}'`, { transaction: t });
            await sequelize.query(`DELETE FROM CHITIETBANHANG WHERE SoPhieuBH IN (SELECT SoPhieuBH FROM PHIEUBANHANG WHERE MaKH = '${id}')`, { transaction: t });
            await sequelize.query(`DELETE FROM PHIEUBANHANG WHERE MaKH = '${id}'`, { transaction: t });
            
            await Customer.destroy({ where: { MaKH: id }, transaction: t });
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async getAllCustomers() {
        return await Customer.findAll();
    }
}

export default CustomerService;