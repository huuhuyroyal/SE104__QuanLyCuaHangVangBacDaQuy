import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailEmployee.css";
import Topbar from "../../components/Topbar/Topbar";
import avatar from "../../assets/customer1.jpg";
import {
  CopyOutlined,
  ClockCircleOutlined,
  MenuOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, DatePicker, Select, message, Spin } from "antd";
import employeeService from "../../services/employeeService";

const { Option } = Select;

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const [state, setState] = useState({
    employeeData: {
      MaTaiKhoan: "",
      TenTaiKhoan: "",
      role: "",
    },
    stats: {
      doanhThu: 0,
      soDonBan: 0,
      soLuongBan: 0,
    },
    filters: {
      date: null,
      dateString: "",
    },
    filteredOrders: [],
    orders: [],
  });

  // Fetch employee details from API
  const fetchEmployeeDetails = async () => {
      try {
          setLoading(true);
          const data = await employeeService.getEmployeeById(id);
          
          setState(prev => ({
              ...prev,
              employeeData: {
                  MaTaiKhoan: data.MaTaiKhoan,
                  TenTaiKhoan: data.TenTaiKhoan,
                  role: data.Role, // Chú ý: Role từ DB thường viết hoa chữ R
              },
              stats: {
                  // Khớp chính xác với tên cột từ SQL (Model trả về)
                  doanhThu: data.DoanhThu || 0,
                  soDonBan: data.SoDonBan || 0,
                  soLuongBan: data.SoLuongBan || 0,
              },
              orders: data.salesHistory || [],
              filteredOrders: data.salesHistory || [],
          }));
          // ... (phần form.setFieldsValue giữ nguyên)
      } catch (error) {
          message.error("Không tìm thấy nhân viên");
          navigate("/ListEmployee");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyDateFilter = () => {
    const { dateString } = state.filters;
    if (!dateString) {
      handleChange("filteredOrders", state.orders);
      return;
    }
    
    // Format dateString để so sánh với date từ database
    const filterDate = new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const filtered = state.orders.filter((order) => {
      return order.date === filterDate;
    });
    handleChange("filteredOrders", filtered);
  };

  const handleSubmit = (values) => {
    console.log("Updated Values:", values);
    message.success("Cập nhật thông tin nhân viên thành công.");
    setIsChanged(false);
    // TODO: Implement update API if needed
  };

  const handleFormChange = () => {
    setIsChanged(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading && !state.employeeData.MaTaiKhoan) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginLeft: "20px" }}>
        <Topbar title="Thông tin chi tiết nhân viên" />
      </div>

      <div className="employee-detail">
        <div className="employee-info">
          <div className="left-section">
            <div className="avatar-placeholder">
              <img src={avatar} alt="avatar-employee" />
            </div>
            <h2 className="employee-name">{state.employeeData.TenTaiKhoan}</h2>
            <span className="status active">{state.employeeData.role}</span>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
            >
              <Form.Item name="MaTaiKhoan" label="Mã nhân viên">
                <Input prefix={<CopyOutlined />} disabled />
              </Form.Item>

              <Form.Item name="TenTaiKhoan" label="Tên đăng nhập">
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item name="role" label="Chức vụ">
                <Select>
                  <Option value="Quản lý">Quản lý</Option>
                  <Option value="Nhân viên bán hàng">Nhân viên bán hàng</Option>
                  <Option value="Nhân viên kho">Nhân viên kho</Option>
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className={`save-button ${isChanged ? "" : "disabled-button"}`}
                disabled={!isChanged}
              >
                Cập nhật
              </Button>
            </Form>
          </div>
        </div>

        <div className="employee-container">
          <div className="employee-stats">
            {/* Card 1: Doanh thu */}
            <div className="stat-card">
              <div className="header">
                <div className="icon-wrapper">
                  <ClockCircleOutlined className="icon" />
                </div>
              </div>
              <div>
                <div className="stat-title">Doanh thu</div>
                <div className="stat-value">{formatCurrency(state.stats.doanhThu)}</div>
              </div>
            </div>

            {/* Card 2: Số lượng bán */}
            <div className="stat-card">
              <div className="header">
                <div className="icon-wrapper">
                  <ShoppingCartOutlined className="icon" />
                </div>
              </div>
              <div>
                <div className="stat-title">Số lượng bán</div>
                <div className="stat-value">{state.stats.soLuongBan}</div>
              </div>
            </div>

            {/* Card 3: Tổng đơn hàng */}
            <div className="stat-card">
              <div className="header">
                <div className="icon-wrapper">
                  <ShoppingOutlined className="icon" />
                </div>
              </div>
              <div className="stat-summary">
                <div className="summary-item">
                  <strong>{state.stats.soDonBan}</strong>
                  <span>Tổng đơn hàng</span>
                </div>
                <div className="summary-item">
                  <strong>{state.orders.filter(o => o.statusClass === 'processing').length}</strong>
                  <span>Đang xử lý</span>
                </div>
                <div className="summary-item">
                  <strong>{state.orders.filter(o => o.statusClass === 'completed').length}</strong>
                  <span>Hoàn thành</span>
                </div>
                <div className="summary-item">
                  <strong>0</strong>
                  <span>Đơn hủy</span>
                </div>
              </div>
            </div>

            {/* Card 4: Đơn hủy và lỗi */}
            <div className="stat-card">
              <div className="header">
                <div className="icon-wrapper">
                  <ShoppingOutlined className="icon" />
                </div>
              </div>
              <div className="stat-summary">
                <div className="summary-item">
                  <strong>0</strong>
                  <span>Số đơn hủy</span>
                </div>
                <div className="summary-item">
                  <strong>0</strong>
                  <span>Hoàn hàng</span>
                </div>
                <div className="summary-item">
                  <strong>0</strong>
                  <span>Hư hại</span>
                </div>
                <div className="summary-item">
                  <strong>0</strong>
                  <span>Báo cáo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="purchase-history">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Lịch sử bán hàng</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  style={{ width: 150, marginRight: "10px" }}
                  onChange={(date, dateString) =>
                    handleChange("filters", {
                      ...state.filters,
                      date,
                      dateString,
                    })
                  }
                />
                <Button
                  type="primary"
                  onClick={applyDateFilter}
                  icon={<MenuOutlined />}
                  style={{ backgroundColor: "#091057" }}
                >
                  Lọc
                </Button>
              </div>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Tình trạng</th>
                    <th>Ngày đặt hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {state.filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    state.filteredOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="order-id">{order.id}</td>
                        <td>
                          {order.product}{" "}
                          {order.extra && <span className="extra">{order.extra}</span>}
                        </td>
                        <td>{order.total}</td>
                        <td className={`status ${order.statusClass}`}>
                          {order.status}
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
