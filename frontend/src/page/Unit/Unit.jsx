import React, { useState, useEffect } from "react";
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
import {
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import unitService from "../../services/unitService";
import "./Unit.css";
import { checkActionPermission } from "../../utils/checkRole";

const Unit = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Load dữ liệu khi component được mount
  useEffect(() => {
    loadUnits();
  }, []);

  // Load dữ liệu từ API
  const loadUnits = async () => {
    try {
      setLoading(true);
      const result = await unitService.getAllUnits();
      if (result.errCode === 0) {
        const formattedData = result.data.map((unit, index) => ({
          ...unit,
          key: unit.MaDVT,
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      } else {
        message.error("Lỗi lấy dữ liệu đơn vị tính");
      }
    } catch (error) {
      message.error(
        "Không thể kết nối Server! Kiểm tra lại Backend xem đã chạy chưa?"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý search
  const handleSearchChange = async (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);

    if (!searchValue.trim()) {
      setFilteredData(data);
    } else {
      try {
        const result = await unitService.searchUnits(searchValue);
        if (result.errCode === 0) {
          const formattedData = result.data.map((unit) => ({
            ...unit,
            key: unit.MaDVT,
          }));
          setFilteredData(formattedData);
        }
      } catch (error) {
        message.error("Lỗi tìm kiếm");
      }
    }
  };

  // Mở modal thêm mới
  const handleAddUnit = () => {
    if (!checkActionPermission(["admin", "warehouse"])) return;
    setIsEditMode(false);
    setSelectedUnit(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const handleEditUnit = (record) => {
    if (!checkActionPermission(["admin", "warehouse"])) return;
    setIsEditMode(true);
    setSelectedUnit(record);
    form.setFieldsValue({
      maDVT: record.MaDVT,
      tenDVT: record.TenDVT,
    });
    setIsModalVisible(true);
  };

  // Xóa đơn vị tính
  const handleDeleteUnit = async (maDVT) => {
    try {
      setLoading(true);
      const result = await unitService.deleteUnit(maDVT);
      if (result.errCode === 0) {
        message.success("Xóa đơn vị tính thành công");
        loadUnits();
      } else {
        message.error(result.message || "Lỗi xóa đơn vị tính");
      }
    } catch (error) {
      message.error("Lỗi xóa đơn vị tính");
    } finally {
      setLoading(false);
    }
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedUnit(null);
  };

  // Lưu đơn vị tính (thêm/cập nhật)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (isEditMode) {
        // Cập nhật
        const result = await unitService.updateUnit(selectedUnit.MaDVT, {
          tenDVT: values.tenDVT,
        });
        if (result.errCode === 0) {
          message.success("Cập nhật đơn vị tính thành công");
          loadUnits();
          handleCancel();
        } else {
          message.error(result.message || "Lỗi cập nhật đơn vị tính");
        }
      } else {
        // Thêm mới
        const result = await unitService.createUnit({
          maDVT: values.maDVT,
          tenDVT: values.tenDVT,
        });
        if (result.errCode === 0) {
          message.success("Thêm đơn vị tính thành công");
          loadUnits();
          handleCancel();
        } else {
          message.error(result.message || "Lỗi thêm đơn vị tính");
        }
      }
    } catch (error) {
      message.error("Lỗi lưu đơn vị tính");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã Đơn Vị Tính",
      dataIndex: "MaDVT",
      key: "MaDVT",
      width: 150,
    },
    {
      title: "Tên Đơn Vị Tính",
      dataIndex: "TenDVT",
      key: "TenDVT",
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => {
        const allowDelete = checkActionPermission(["admin"], false);
        return (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditUnit(record)}
              size="small"
            >
              Sửa
            </Button>
            {allowDelete ? (
              <Popconfirm
                title="Xóa đơn vị tính"
                description="Bạn có chắc chắn muốn xóa đơn vị tính này?"
                onConfirm={() => handleDeleteUnit(record.MaDVT)}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />} size="small">
                  Xóa
                </Button>
              </Popconfirm>
            ) : (
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() =>
                  message.error("Liên hệ admin để xóa đơn vị tính này")
                }
              >
                Xóa
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="main">
      <header className="Unit-header">
        <Input.Search
          placeholder="Tìm kiếm theo mã hoặc tên đơn vị tính..."
          onChange={handleSearchChange}
          value={searchText}
        />

        <div className="add-section">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="add-product"
            onClick={handleAddUnit}
          >
            Thêm đơn vị tính
          </Button>
        </div>
      </header>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      {/* Modal thêm/cập nhật đơn vị tính */}
      <Modal
        title={isEditMode ? "Chỉnh sửa đơn vị tính" : "Thêm đơn vị tính"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mã Đơn Vị Tính"
            name="maDVT"
            rules={[
              { required: true, message: "Vui lòng nhập mã đơn vị tính" },
            ]}
          >
            <Input placeholder="Ví dụ: DVT11" disabled={isEditMode} />
          </Form.Item>

          <Form.Item
            label="Tên Đơn Vị Tính"
            name="tenDVT"
            rules={[
              { required: true, message: "Vui lòng nhập tên đơn vị tính" },
            ]}
          >
            <Input placeholder="Ví dụ: Cái, Viên, Gram..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Unit;
