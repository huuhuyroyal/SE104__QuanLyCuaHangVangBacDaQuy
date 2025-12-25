import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('QLBH', 'root', '', {
    host: '127.0.0.1', // Dùng IP thay vì localhost cho ổn định
    dialect: 'mysql',
    port: 3306,
    logging: false,
    define: {
        freezeTableName: true
    }
});

// Test kết nối ngay khi khởi động
sequelize.authenticate()
    .then(() => console.log('✅ Đã kết nối MySQL qua XAMPP thành công!'))
    .catch(err => console.error('❌ Không thể kết nối SQL:', err));