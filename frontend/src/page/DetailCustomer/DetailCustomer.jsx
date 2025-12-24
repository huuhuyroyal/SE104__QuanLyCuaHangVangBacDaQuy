import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, message, Spin, Card, Space } from "antd";
import { 
    CopyOutlined, 
    EnvironmentOutlined, 
    PhoneOutlined, 
    ClockCircleOutlined, 
    ShoppingOutlined, 
    ArrowLeftOutlined,
    SaveOutlined
} from "@ant-design/icons";
import { customerService } from "../../services/customerService";
import Topbar from "../../components/Topbar/Topbar";
const avatar = "/ca_nhan.svg"; // use public asset
import "./DetailCustomer.css";

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);
    const [data, setData] = useState({
        customer: {},
        totalSpending: 0,
        totalOrders: 0,
        orders: []
    });

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const res = await customerService.getCustomerById(id);

            setData({
                customer: res,
                totalSpending: res.TongChiTieu || 0,
                totalOrders: res.SoLuongDonHang || 0,
                orders: res.orderHistory || []
            });

            // Defer setting form values until after the Form is mounted (loading=false)
            // store the values and apply after loading completes
            fetchCustomerDetails._pendingFormValues = {
                id: res.MaKH,
                name: res.TenKH,
                phone: res.SoDienThoai,
                address: res.DiaChi
            };
        } catch (error) {
            message.error("Không thể tải thông tin khách hàng");
        } finally {
            setLoading(false);
            // apply pending form values if present
            const vals = fetchCustomerDetails._pendingFormValues;
            if (vals) {
                // give React a tick so Form mounts
                setTimeout(() => {
                    try {
                        form.setFieldsValue(vals);
                    } catch (e) {
                        // ignore if form not yet connected
                    }
                    fetchCustomerDetails._pendingFormValues = null;
                }, 0);
            }
        }
    };

    const handleSubmit = async (values) => {
        try {
            await customerService.updateCustomer(id, {
                TenKH: values.name,
                SoDienThoai: values.phone,
                DiaChi: values.address
            });
            message.success("Cập nhật thành công!");
            setIsChanged(false);
            fetchCustomerDetails();
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };

    if (loading) return <div className="loading-container"><Spin size="large" /></div>;

    return (
        <div className="detail-page">
            <div style={{ marginLeft: "20px" }}>
                <Topbar title="Hồ sơ khách hàng" />
            </div>

            <div className="detail-container">
                {/* Section bên trái: Thông tin cá nhân */}
                <div className="profile-section">
                    <Card className="profile-card">
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate(-1)} 
                            className="back-btn"
                        > Quay lại</Button>
                        
                        <div className="avatar-wrapper">
                            <img src={avatar} alt="Customer" />
                            <h2>{data.customer.TenKH}</h2>
                            <div className="customer-tag">Khách hàng thân thiết</div>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            onValuesChange={() => setIsChanged(true)}
                        >
                            <Form.Item name="id" label="Mã khách hàng">
                                <Input prefix={<CopyOutlined />} disabled />
                            </Form.Item>
                            <Form.Item name="name" label="Tên khách hàng" rules={[{required: true}]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{required: true}]}>
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ" rules={[{required: true}]}>
                                <Input prefix={<EnvironmentOutlined />} />
                            </Form.Item>

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                icon={<SaveOutlined />}
                                disabled={!isChanged}
                                className="save-btn"
                            >
                                Lưu thay đổi
                            </Button>
                        </Form>
                    </Card>
                </div>

                {/* Section bên phải: Thống kê & Lịch sử */}
                <div className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <ClockCircleOutlined className="stat-icon" />
                            <div className="stat-info">
                                <span>Tổng chi tiêu</span>
                                <h3>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalSpending)}</h3>
                            </div>
                        </div>
                        <div className="stat-box">
                            <ShoppingOutlined className="stat-icon" />
                            <div className="stat-info">
                                <span>Tổng đơn hàng</span>
                                <h3>{data.totalOrders} đơn</h3>
                            </div>
                        </div>
                    </div>

                    <Card title="Lịch sử mua hàng" className="history-card">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Sản phẩm</th>
                                    <th>Tổng tiền</th>
                                    <th>Ngày đặt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.orders.length > 0 ? data.orders.map((order, idx) => (
                                    <tr key={idx}>
                                        <td className="order-id">{order.id}</td>
                                        <td>{order.product_summary}</td>
                                        <td className="order-total">
                                            {new Intl.NumberFormat('vi-VN').format(order.total)} đ
                                        </td>
                                        <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Chưa có lịch sử mua hàng</td></tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;