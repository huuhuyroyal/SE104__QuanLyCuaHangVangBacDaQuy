import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Space,
  Card,
  Tag,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import "./ListCustomer.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  // Load danh sách khách hàng từ Backend
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      if (data && data.errCode === 0) {
        setCustomers(data.data);
      } else {
        message.error(data.message || "Lỗi lấy dữ liệu");
        setCustomers([]);
      }
    } catch (error) {
      message.error("Không thể tải danh sách khách hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Xử lý Thêm khách hàng (Bắt buộc đầy đủ trường của bảng KHACHHANG)
  const handleAddCustomer = async (values) => {
    try {
      const customerData = {
        MaKH: values.MaKH,
        TenKH: values.TenKH,
        SoDienThoai: values.SoDienThoai,
        DiaChi: values.DiaChi,
      };
      const res = await customerService.createCustomer(customerData);
      if (res && res.errCode === 0) {
        message.success("Thêm khách hàng thành công!");
        setIsAddModalVisible(false);
        addForm.resetFields();
        fetchCustomers();
      } else {
        message.error(res.message || "Thêm thất bại, vui lòng kiểm tra lại!");
      }
    } catch (error) {
      // Lỗi hệ thống/mạng
      console.error(error);
      message.error("Lỗi hệ thống khi thêm khách hàng");
    }
  };

  // Xử lý Xóa khách hàng
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa khách hàng?",
      content:
        "Hành động này sẽ xóa toàn bộ lịch sử hóa đơn và thông tin liên quan.",
      okText: "Xóa vĩnh viễn",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await customerService.deleteCustomer(id);
          console.log("Delete response:", res);
          if (res && res.errCode === 0) {
            message.success("Đã xóa khách hàng thành công");
            fetchCustomers();
          } else {
            message.error(res.message || "Lỗi khi xóa khách hàng");
          }
        } catch (error) {
          message.error("Lỗi hệ thống");
          console.error(error);
        }
      },
    });
  };

  // Tính năng Search (Tìm theo Tên hoặc Mã)
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.TenKH.toLowerCase().includes(searchText.toLowerCase()) ||
        c.MaKH.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [customers, searchText]);

  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "MaKH",
      key: "MaKH",
      render: (text) => <b style={{ color: "#3E0703" }}>{text}</b>,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "TenKH",
      key: "TenKH",
    },
    {
      title: "Số điện thoại",
      dataIndex: "SoDienThoai",
      key: "SoDienThoai",
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
      key: "DiaChi",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#3E0703" }} />}
            onClick={() => navigate(`/customer-detail/${record.MaKH}`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.MaKH)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="customer-page-container">
        <Card className="customer-card">
          <div className="customer-header-actions">
            <Input
              placeholder="Tìm kiếm khách hàng (Tên/Mã)..."
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="btn-add"
                onClick={() => setIsAddModalVisible(true)}
              >
                Thêm khách hàng
              </Button>
            </Space>
          </div>

          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="MaKH"
            pagination={{ pageSize: 7 }}
            className="custom-table"
            onRow={(record) => ({
              onDoubleClick: () => navigate(`/customer-detail/${record.MaKH}`),
            })}
          />
        </Card>

        {/* Modal Thêm Khách Hàng */}
        <Modal
          title={<span className="modal-title">THÊM KHÁCH HÀNG MỚI</span>}
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form
            form={addForm}
            layout="vertical"
            onFinish={handleAddCustomer}
            className="add-customer-form"
          >
            <Form.Item
              name="MaKH"
              label="Mã khách hàng"
              rules={[
                { required: true, message: "Vui lòng nhập mã khách hàng!" },
                { max: 10, message: "Mã khách hàng tối đa 10 ký tự!" }, // Ví dụ validation
              ]}
            >
              <Input placeholder="Ví dụ: KH001" />
            </Form.Item>
            <Form.Item
              name="TenKH"
              label="Họ và tên"
              rules={[
                { required: true, message: "Vui lòng nhập tên khách hàng!" },
              ]}
            >
              <Input placeholder="Nhập tên đầy đủ" />
            </Form.Item>
            <Form.Item
              name="SoDienThoai"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại liên lạc" />
            </Form.Item>
            <Form.Item
              name="DiaChi"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ cư trú" />
            </Form.Item>
            <Form.Item className="modal-footer">
              <Space>
                <Button onClick={() => setIsAddModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" className="btn-submit">
                  Xác nhận thêm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerList;
