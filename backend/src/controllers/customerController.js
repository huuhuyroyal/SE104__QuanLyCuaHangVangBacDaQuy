// Convert controller to ES module and support importing a CommonJS service via dynamic import
const CustomerServiceModule = await import('../service/customerService.js');
const CustomerService = CustomerServiceModule.default || CustomerServiceModule;

const getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerService.getAllCustomers();
        return res.status(200).json(customers);
    } catch (error) {
        console.error('getAllCustomers error:', error);
        return res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await CustomerService.getCustomerById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
        }
        return res.status(200).json(customer);
    } catch (error) {
        console.error('getCustomerById error:', error);
        return res.status(500).json({ message: 'Lỗi khi lấy thông tin khách hàng', error: error.message });
    }
};

const createCustomer = async (req, res) => {
    try {
        const newCustomer = await CustomerService.createCustomer(req.body);
        return res.status(201).json({ message: 'Thêm khách hàng thành công', data: newCustomer });
    } catch (error) {
        console.error('createCustomer error:', error);
        return res.status(400).json({ message: 'Không thể tạo khách hàng', error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCustomer = await CustomerService.updateCustomer(id, req.body);
        return res.status(200).json({ message: 'Cập nhật thông tin thành công', data: updatedCustomer });
    } catch (error) {
        console.error('updateCustomer error:', error);
        return res.status(400).json({ message: 'Lỗi khi cập nhật thông tin', error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await CustomerService.deleteCustomer(id);
        return res.status(200).json({ message: 'Đã xóa khách hàng và các dữ liệu liên quan' });
    } catch (error) {
        console.error('deleteCustomer error:', error);
        return res.status(500).json({ message: 'Lỗi khi xóa khách hàng', error: error.message });
    }
};

export default {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};