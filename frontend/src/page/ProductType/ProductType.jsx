import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  InputNumber,
  Space,
  Popconfirm,
  Select,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import {
  getAllProductTypesService,
  createProductTypeService,
  updateProductTypeService,
  deleteProductTypeService,
} from "../../services/productTypeService";

import unitService from "../../services/unitService";

const ProductType = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllProductTypesService();
      if (res && res.errCode === 0) {
        const formatted = res.data.map((item) => ({
          key: item.MaLoaiSanPham,
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


  const fetchUnits = async () => {
    try {
      const res = await unitService.getAllUnits();
      if (res && res.errCode === 0) {
        setUnits(
          res.data.map((u) => ({
            label: u.TenDVT,
            value: u.MaDVT,
          }))
        );
      }
    } catch (error) {
      message.error("Lỗi tải đơn vị tính");
    }
  };

  useEffect(() => {
    fetchData();
    fetchUnits();
  }, []);


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.TenLoaiSanPham.toLowerCase().includes(value) ||
        item.MaLoaiSanPham.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };


  const handleOpenAdd = () => {
    setIsEdit(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setIsEdit(true);
    form.setFieldsValue({
      MaLoaiSanPham: record.MaLoaiSanPham,
      TenLoaiSanPham: record.TenLoaiSanPham,
      MaDVT: record.MaDVT,
      PhanTramLoiNhuan: record.PhanTramLoiNhuan,
    });
    setIsModalOpen(true);
  };


const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = isEdit
        ? await updateProductTypeService(values)
        : await createProductTypeService(values);

      console.log("Server Response:", res); 

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


  const handleDelete = async (id) => {
    try {
      const res = await deleteProductTypeService(id);
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

  const columns = [
    { title: "Mã loại", dataIndex: "MaLoaiSanPham" },
    { title: "Tên loại", dataIndex: "TenLoaiSanPham" },
    { title: "Đơn vị tính", dataIndex: "TenDVT" },
    {
      title: "Lợi nhuận",
      dataIndex: "PhanTramLoiNhuan",
      render: (val) => `${(val * 100).toFixed(0)}%`,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.MaLoaiSanPham)}
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
        <header className="Product-header">
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
        />

        <Modal
          title={isEdit ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
          okText={isEdit ? "Lưu" : "Thêm"}
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="MaLoaiSanPham"
              label="Mã loại"
              rules={[{ required: true, message: "Nhập mã loại" }]}
            >
              <Input disabled={isEdit} placeholder="Ví dụ: LSP01" />
            </Form.Item>

            <Form.Item
              name="TenLoaiSanPham"
              label="Tên loại sản phẩm"
              rules={[{ required: true, message: "Nhập tên loại" }]}
            >
              <Input placeholder="Ví dụ: Nhẫn vàng" />
            </Form.Item>

            <Form.Item
              name="MaDVT"
              label="Đơn vị tính"
              rules={[{ required: true, message: "Chọn đơn vị tính" }]}
            >
              <Select placeholder="Chọn đơn vị tính" options={units} />
            </Form.Item>

            <Form.Item
              name="PhanTramLoiNhuan"
              label="Tỉ lệ lợi nhuận (0.1 = 10%)"
              rules={[{ required: true, message: "Nhập % lợi nhuận" }]}
            >
              <InputNumber
                min={0}
                max={1}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.1"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductType;
