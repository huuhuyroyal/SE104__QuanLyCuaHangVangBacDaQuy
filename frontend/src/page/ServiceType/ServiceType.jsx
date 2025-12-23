import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Space,
  Popconfirm,
  InputNumber,
  Tag
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getAllServiceTypesService,
  createServiceTypeService,
  updateServiceTypeService,
  deleteServiceTypeService,
} from "../../services/serviceTypeService";

const ServiceType = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllServiceTypesService();
      if (res && res.errCode === 0) {
        const formatted = res.data.map((item) => ({
          key: item.MaLoaiDV,
          ...item,
        }));
        setData(formatted);
        setFilteredData(formatted);
      }
    } catch (error) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search function
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.TenLoaiDV.toLowerCase().includes(value) ||
        item.MaLoaiDV.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEdit(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (record) => {
    setIsEdit(true);
    form.setFieldsValue({
      MaLoaiDV: record.MaLoaiDV,
      TenLoaiDV: record.TenLoaiDV,
      DonGiaDV: record.DonGiaDV,
      PhanTramTraTruoc: record.PhanTramTraTruoc
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = isEdit
        ? await updateServiceTypeService(values)
        : await createServiceTypeService(values);

      if (res && res.errCode === 0) {
        message.success(res.message);
        setIsModalOpen(false);
        fetchData();
      } else {
        message.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const res = await deleteServiceTypeService(id);
      if (res && res.errCode === 0) {
        message.success("Xóa thành công");
        fetchData();
      } else {
        message.error(res.message || "Không thể xóa");
      }
    } catch (error) {
      message.error("Lỗi hệ thống");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Table Columns Configuration
  const columns = [
    { title: "Mã loại dịch vụ", dataIndex: "MaLoaiDV", width: "15%" },
    { title: "Tên loại dịch vụ", dataIndex: "TenLoaiDV", width: "30%", render: (text) => <b>{text}</b> },
    { 
      title: "Đơn giá dịch vụ", 
      dataIndex: "DonGiaDV", 
      align: 'right',
      render: (val) => <span style={{ color: '#1677ff' }}>{formatCurrency(val)}</span> 
    },
    { 
      title: "Trả trước (%)", 
      dataIndex: "PhanTramTraTruoc", 
      align: 'center',
      render: (val) => <Tag color="green">{val}%</Tag> 
    },
    {
      title: "Hành động",
      width: "15%",
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.MaLoaiDV)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="main">
      <div className="Product-main-content">
        <header className="Product-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="Tìm theo mã hoặc tên..."
            onChange={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            Thêm mới
          </Button>
        </header>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
          rowKey="MaLoaiDV"
        />

        {/* Create/Edit Modal */}
        <Modal
          title={isEdit ? "Cập nhật loại dịch vụ" : "Thêm loại dịch vụ"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
          okText={isEdit ? "Lưu" : "Thêm"}
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="MaLoaiDV"
              label="Mã loại dịch vụ"
              rules={[{ required: true, message: "Vui lòng nhập mã loại" }]}
            >
              <Input disabled={isEdit} placeholder="Ví dụ: LDV01" />
            </Form.Item>

            <Form.Item
              name="TenLoaiDV"
              label="Tên loại dịch vụ"
              rules={[{ required: true, message: "Vui lòng nhập tên loại" }]}
            >
              <Input placeholder="Ví dụ: Đánh bóng trang sức" />
            </Form.Item>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="DonGiaDV"
                label="Đơn giá (VNĐ)"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Nhập đơn giá" }]}
                initialValue={0}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="PhanTramTraTruoc"
                label="Phần trăm trả trước (%)"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Nhập % trả trước" }]}
                initialValue={0}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  max={100} 
                  placeholder="Ví dụ: 50"
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceType;