import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Customer = sequelize.define('KHACHHANG', {
    MaKH: { 
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    TenKH: { 
        type: DataTypes.STRING(100),
        allowNull: false
    },
    SoDienThoai: { 
        type: DataTypes.STRING(15)
    },
    DiaChi: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'KHACHHANG', // Ép buộc dùng đúng tên trong SQL
    timestamps: true,      // Database của bạn có cột này nên để true
    freezeTableName: true  // Không tự ý thêm chữ 's'
});

export default Customer;