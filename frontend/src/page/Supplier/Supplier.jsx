import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import supplierService from "../../services/supplierService";
import "./Supplier.css";

const SupplierPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const result = await supplierService.getSuppliers();
      if (result.errCode === 0) {
        const formatted = result.data.map((item) => ({ ...item, key: item.MaNCC }));
        setData(formatted);
        setFilteredData(formatted);
      } else {
        message.error(result.message || "Lỗi lấy dữ liệu nhà cung cấp");
      }
    } catch (error) {
      message.error("Không thể kết nối server! Kiểm tra Backend đã chạy chưa?");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setFilteredData(data);
      return;
    }

    try {
      const result = await supplierService.searchSuppliers(value.trim());
      if (result.errCode === 0) {
        const formatted = result.data.map((item) => ({ ...item, key: item.MaNCC }));
        setFilteredData(formatted);
      }
    } catch (error) {
      message.error("Lỗi tìm kiếm nhà cung cấp");
    }
  };

  const handleAddSupplier = () => {
    setIsEditMode(false);
    setSelectedSupplier(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditSupplier = (record) => {
    setIsEditMode(true);
    setSelectedSupplier(record);
    form.setFieldsValue({
      maNCC: record.MaNCC,
      tenNCC: record.TenNCC,
      diaChi: record.DiaChi,
      soDienThoai: record.SoDienThoai,
    });
    setIsModalVisible(true);
  };

  const handleDeleteSupplier = async (maNCC) => {
    try {
      setLoading(true);
      const result = await supplierService.deleteSupplier(maNCC);
      if (result.errCode === 0) {
        message.success("Xóa nhà cung cấp thành công");
        await loadSuppliers();
      } else {
        message.error(result.message || "Lỗi xóa nhà cung cấp");
      }
    } catch (error) {
      message.error("Lỗi xóa nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedSupplier(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (isEditMode && selectedSupplier) {
        const result = await supplierService.updateSupplier(selectedSupplier.MaNCC, {
          tenNCC: values.tenNCC,
          diaChi: values.diaChi,
          soDienThoai: values.soDienThoai,
        });
        if (result.errCode === 0) {
          message.success("Cập nhật nhà cung cấp thành công");
          await loadSuppliers();
          handleCancel();
        } else {
          message.error(result.message || "Lỗi cập nhật nhà cung cấp");
        }
      } else {
        const result = await supplierService.createSupplier({
          maNCC: values.maNCC,
          tenNCC: values.tenNCC,
          diaChi: values.diaChi,
          soDienThoai: values.soDienThoai,
        });
        if (result.errCode === 0) {
          message.success("Thêm nhà cung cấp thành công");
          await loadSuppliers();
          handleCancel();
        } else {
          message.error(result.message || "Lỗi thêm nhà cung cấp");
        }
      }
    } catch (error) {
      message.error("Lỗi lưu nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã NCC",
      dataIndex: "MaNCC",
      key: "MaNCC",
      width: 140,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "TenNCC",
      key: "TenNCC",
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
      key: "DiaChi",
    },
    {
      title: "SĐT",
      dataIndex: "SoDienThoai",
      key: "SoDienThoai",
      width: 140,
    },
    {
      title: "Hành động",
      key: "action",
      width: 170,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditSupplier(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhà cung cấp"
            description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
            onConfirm={() => handleDeleteSupplier(record.MaNCC)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="main">
      <header className="Supplier-header">
        <Input.Search
          placeholder="Tìm kiếm nhà cung cấp..."
          onChange={handleSearchChange}
          value={searchText}
        />

        <div className="add-section">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-supplier"
            onClick={handleAddSupplier}
          >
            Thêm nhà cung cấp
          </Button>
        </div>
      </header>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={isEditMode ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mã nhà cung cấp"
            name="maNCC"
            rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp" }]}
          >
            <Input placeholder="Ví dụ: NCC01" disabled={isEditMode} />
          </Form.Item>

          <Form.Item
            label="Tên nhà cung cấp"
            name="tenNCC"
            rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp" }]}
          >
            <Input placeholder="Ví dụ: Công ty vàng bạc ABC" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diaChi">
            <Input placeholder="Số nhà, đường, quận/huyện" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="soDienThoai"
            rules={[
              {
                pattern: /^[0-9]{7,15}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Ví dụ: 0909123456" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierPage;
