import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  App,
  ConfigProvider,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import employeeService from "../../services/employeeService";
import "./ListEmployee.css";

const ListEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Service đã xử lý để trả về mảng [..], nên ở đây nhận trực tiếp
      const data = await employeeService.getAllEmployees();
      console.log("Dữ liệu về bảng:", data); // Log kiểm tra

      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. Xử lý Tạo mới
  const handleCreate = async (values) => {
    try {
      // Gọi API
      const res = await employeeService.createEmployee(values);

      // KIỂM TRA MÃ LỖI (errCode === 0 là thành công)
      if (res && res.errCode === 0) {
        message.success("Tạo tài khoản thành công!");
        setIsModalVisible(false);
        form.resetFields(); // Xóa form
        await fetchEmployees(); // Tải lại bảng ngay lập tức
      } else {
        // Hiện lỗi từ backend trả về (ví dụ: "Tên tài khoản đã tồn tại")
        message.error(res?.message || "Tạo thất bại");
      }
    } catch (err) {
      message.error("Lỗi hệ thống");
    }
  };

  // 3. Xử lý Xóa
  const handleDelete = async (id) => {
    try {
      const res = await employeeService.deleteEmployee(id);

      if (res && res.errCode === 0) {
        message.success("Xóa thành công");
        await fetchEmployees(); // Tải lại bảng ngay lập tức
      } else {
        message.error(res?.message || "Xóa thất bại");
      }
    } catch (e) {
      message.error("Lỗi hệ thống");
    }
  };

  const filteredData = employees.filter(
    (emp) =>
      (emp.TenTaiKhoan &&
        emp.TenTaiKhoan.toLowerCase().includes(search.toLowerCase())) ||
      String(emp.MaTaiKhoan).includes(search)
  );

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "MaTaiKhoan",
      key: "MaTaiKhoan",
      render: (id) => <b>NV{String(id).padStart(3, "0")}</b>,
    },
    { title: "Tên đăng nhập", dataIndex: "TenTaiKhoan", key: "TenTaiKhoan" },
    {
      title: "Chức vụ",
      dataIndex: "Role",
      key: "Role",
      render: (role) => {
        const map = {
          admin: ["volcano", "Quản lý"],
          seller: ["green", "Bán hàng"],
          warehouse: ["blue", "Thủ kho"],
        };
        const [color, text] = map[role] || ["default", role];
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          {record.TenTaiKhoan !== currentUser.TenTaiKhoan && (
            <Popconfirm
              title="Xác nhận xóa?"
              onConfirm={() => handleDelete(record.MaTaiKhoan)}
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="list-employee-container" style={{ padding: "5px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ width: 400 }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm nhân viên
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="MaTaiKhoan"
      />
      <Modal
        title="Tạo tài khoản"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="TenTaiKhoan"
            label="Tên Tài Khoản"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="MatKhau"
            label="Mật khẩu"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="Role" label="Chức vụ" initialValue="seller">
            <Select>
              <Select.Option value="seller">Bán hàng</Select.Option>
              <Select.Option value="warehouse">Thủ kho</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListEmployee;
