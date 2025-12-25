import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Spin, Card, Space } from "antd";
import {
  CopyOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import customerService from "../../services/customerService";
import "./CustomerDetail.css";

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
    orders: [],
  });

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomerById(id);
      if (response && response.errCode === 0) {
        const customerInfo = response.data; // Lấy dữ liệu từ thuộc tính .data

        setData({
          customer: customerInfo,
          totalSpending: customerInfo.TongChiTieu || 0,
          totalOrders: customerInfo.SoLuongDonHang || 0,
          orders: customerInfo.orderHistory || [],
        });

        // Set dữ liệu vào form
        const formValues = {
          id: customerInfo.MaKH,
          name: customerInfo.TenKH,
          phone: customerInfo.SoDienThoai,
          address: customerInfo.DiaChi,
        };

        // Dùng setTimeout để đảm bảo form đã mount
        setTimeout(() => {
          form.setFieldsValue(formValues);
        }, 0);
      } else {
        message.error(
          response.message || "Không tìm thấy thông tin khách hàng"
        );
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Lỗi khi tải thông tin chi tiết");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        TenKH: values.name,
        SoDienThoai: values.phone,
        DiaChi: values.address,
      };

      const response = await customerService.updateCustomer(id, payload);
      const result = response && response.data ? response.data : response;

      if (result && result.errCode === 0) {
        message.success("Cập nhật thành công!");
        setIsChanged(false);
        fetchCustomerDetails();
      } else {
        message.error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      message.error("Lỗi hệ thống khi cập nhật");
    }
  };

  if (loading)
    return (
      <div
        className="loading-container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Section bên trái: Thông tin cá nhân */}
        <div className="profile-section">
          <Card className="profile-card">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              {" "}
              Quay lại
            </Button>

            <div className="avatar-wrapper">
              {/* Ảnh placeholder */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "#f0f0f0",
                  borderRadius: "50%",
                  margin: "0 auto 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                }}
              >
                👤
              </div>
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
              <Form.Item
                name="name"
                label="Tên khách hàng"
                rules={[{ required: true, message: "Tên không được để trống" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "SĐT không được để trống" }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  { required: true, message: "Địa chỉ không được để trống" },
                ]}
              >
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
                <h3>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data.totalSpending)}
                </h3>
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
                {data.orders && data.orders.length > 0 ? (
                  data.orders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.product_summary}</td>
                      <td className="order-total">
                        {new Intl.NumberFormat("vi-VN").format(order.total)} đ
                      </td>
                      <td>
                        {new Date(order.date).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Chưa có lịch sử mua hàng
                    </td>
                  </tr>
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
