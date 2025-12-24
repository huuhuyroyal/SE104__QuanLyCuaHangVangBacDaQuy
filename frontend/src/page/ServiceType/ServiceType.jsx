import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  message,
  Tag,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import * as ticketService from "../../services/serviceTicketService";
import { getAllServiceTypesService } from "../../services/serviceTypeService";
import { getAllCustomersService } from "../../services/customerService";
import { checkActionPermission } from "../../utils/checkRole";

const ServiceTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  
  // Search state with debounce
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // State cho trạng thái mới trong modal chi tiết
  const [targetStatus, setTargetStatus] = useState("");

  // Form & Items
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const fetchData = async (q) => {
    setLoading(true);
    try {
      const res = await ticketService.getAllServiceTickets(q);
      if (res && res.errCode === 0) setTickets(res.data);
    } catch (error) {
      message.error("Lỗi tải dữ liệu phiếu dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [custRes, typeRes] = await Promise.all([
        getAllCustomersService(),
        getAllServiceTypesService(),
      ]);
      if (custRes.data) setCustomers(custRes.data);
      if (typeRes.data) setServiceTypes(typeRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu khách hàng/loại dịch vụ");
    }
  };

  // Handle Search with Debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchData(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Calculate totals based on items
  const calculateTotals = (currentItems) => {
    const total = currentItems.reduce(
      (sum, item) => sum + (item.ThanhTien || 0),
      0
    );
    const prepaid = currentItems.reduce(
      (sum, item) => sum + (item.TraTruoc || 0),
      0
    );
    return {
      TongTien: total,
      TongTienTraTruoc: prepaid,
      TongTienConLai: total - prepaid,
    };
  };

  const handleAddItem = () => {
    if (!checkActionPermission(["seller", "admin"], false))
      return message.error("Bạn không có quyền thực hiện chức năng này");

    setItems([
      ...items,
      {
        key: Date.now(),
        MaLoaiDV: null,
        SoLuong: 1,
        DonGiaDuocTinh: 0,
        ThanhTien: 0,
        TraTruoc: 0,
        PhanTramTraTruoc: 0, 
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    if (!checkActionPermission(["seller", "admin"], false))
      return message.error("Bạn không có quyền cập nhật phiếu dịch vụ");

    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === "MaLoaiDV") {
      const type = serviceTypes.find((t) => t.MaLoaiDV === value);
      if (type) {
        item.DonGiaDuocTinh = type.DonGiaDV;
        item.PhanTramTraTruoc = type.PhanTramTraTruoc;
      }
    }

    if (field === "MaLoaiDV" || field === "SoLuong" || field === "DonGiaDuocTinh") {
      item.ThanhTien = item.SoLuong * item.DonGiaDuocTinh;
      const type = serviceTypes.find((t) => t.MaLoaiDV === item.MaLoaiDV);
      const percent = type ? type.PhanTramTraTruoc : (item.PhanTramTraTruoc || 0);
      item.TraTruoc = item.ThanhTien * percent;
    }

    newItems[index] = item;
    setItems(newItems);

    const totals = calculateTotals(newItems);
    form.setFieldsValue(totals);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const totals = calculateTotals(newItems);
    form.setFieldsValue(totals);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (items.length === 0) {
        return message.error("Vui lòng thêm ít nhất một dịch vụ vào danh sách!");
      }

      const hasInvalidItem = items.some(
        (item) => !item.MaLoaiDV || !item.SoLuong || item.SoLuong < 1
      );

      if (hasInvalidItem) {
        return message.error(
          "Vui lòng chọn 'Loại dịch vụ' và nhập 'Số lượng' cho tất cả các dòng!"
        );
      }

      let finalDateStr;
      if (values.NgayLap) {
        const timePart = new Date().toLocaleTimeString('en-GB');
        finalDateStr = `${values.NgayLap} ${timePart}`;
      } else {
         const now = new Date();
         const offsetMs = now.getTimezoneOffset() * 60 * 1000;
         const msLocal = now.getTime() - offsetMs;
         finalDateStr = new Date(msLocal).toISOString().slice(0, 19).replace("T", " ");
      }

      const payload = {
        ...values,
        items: items,
        NgayLap: finalDateStr,
        TinhTrang: "Đang xử lý",
      };

      const res = await ticketService.createServiceTicket(payload);

      if (res.errCode === 0) {
        message.success(res.message);
        setIsCreateOpen(false);
        form.resetFields();
        setItems([]);
        fetchData();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.error("Save failed:", error);
      if (!error.errorFields) {
        message.error("Đã xảy ra lỗi khi lưu phiếu: " + error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (!checkActionPermission(["admin"], false))
      return message.error("Chỉ Admin mới có quyền xóa phiếu dịch vụ");

    if (selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: "Xóa phiếu",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} phiếu?`,
      onOk: async () => {
        const res = await ticketService.deleteServiceTickets(selectedRowKeys);
        if (res.errCode === 0) {
          message.success("Đã xóa thành công");
          setSelectedRowKeys([]);
          fetchData();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const handleViewDetail = async (record) => {
    const res = await ticketService.getServiceTicketById(record.SoPhieuDV);
    if (res.errCode === 0) {
      setSelectedTicket(res.data);
      // Đặt trạng thái hiện tại vào state để hiển thị trong Select
      setTargetStatus(res.data.ticket.TinhTrang);
      setIsDetailOpen(true);
    }
  };

  const handleUpdateStatus = async () => {
    if (!checkActionPermission(["seller", "admin"], false))
      return message.error("Bạn không có quyền cập nhật trạng thái phiếu dịch vụ");

    if (!selectedTicket) return;
    
    // Sử dụng targetStatus từ Select
    const res = await ticketService.updateServiceTicketStatus(
      selectedTicket.ticket.SoPhieuDV,
      targetStatus
    );
    
    if (res.errCode === 0) {
      message.success(`Đã cập nhật trạng thái thành: ${targetStatus}`);
      setIsDetailOpen(false);
      fetchData();
    } else {
      message.error(res.message || "Cập nhật thất bại");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hoàn thành': return 'green';
      case 'Đã hủy': return 'red';
      case 'Đã giao': return 'blue';
      default: return 'orange';
    }
  };

  const columns = [
    { title: "Số Phiếu", dataIndex: "SoPhieuDV", key: "SoPhieuDV" },
    { title: "Khách hàng", dataIndex: "TenKH", key: "TenKH" },
    {
      title: "Ngày lập",
      dataIndex: "NgayLap",
      render: (val) => new Date(val).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Trả trước",
      dataIndex: "TongTienTraTruoc",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Còn lại",
      dataIndex: "TongTienConLai",
      render: (val) => (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "TinhTrang",
      render: (val) => (
        <Tag color={getStatusColor(val)}>{val}</Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          size="small"
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="main">
      <header className="Unit-header">
        <Input.Search
          placeholder="Tìm theo mã phiếu hoặc tên KH..."
          style={{ width: 300 }}
          onChange={handleSearchChange} 
          value={searchText}
        />
        <div className="add-section">
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleDelete}
          >
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (!checkActionPermission(["seller", "admin"], false))
                return message.error("Bạn không có quyền tạo phiếu dịch vụ");
              setIsCreateOpen(true);
              form.resetFields();
              setItems([]);
            }}
          >
            Tạo phiếu dịch vụ
          </Button>
        </div>
      </header>

      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="SoPhieuDV"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
      />

      {/* CREATE MODAL */}
      <Modal
        title="Tạo Phiếu Dịch Vụ Mới"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleSave}
        width={900}
        okText="Lưu phiếu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="SoPhieuDV"
                label="Số Phiếu"
                rules={[{ required: true, message: "Vui lòng nhập số phiếu" }]}
              >
                <Input placeholder="Ví dụ: PDV01" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="MaKH"
                label="Khách hàng"
                rules={[
                  { required: true, message: "Vui lòng chọn khách hàng" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Chọn khách hàng"
                >
                  {customers.map((c) => (
                    <Select.Option key={c.MaKH} value={c.MaKH}>
                      {c.TenKH} - {c.SoDienThoai}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="NgayLap"
                label="Ngày lập"
                initialValue={new Date().toISOString().split("T")[0]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              marginBottom: 16,
              border: "1px solid #f0f0f0",
              padding: 10,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong>Chi tiết dịch vụ</strong>
              <Button size="small" type="dashed" onClick={handleAddItem}>
                + Thêm dịch vụ
              </Button>
            </div>
            {items.map((item, index) => (
              <Row
                gutter={8}
                key={item.key || index}
                style={{ marginBottom: 8, alignItems: "center" }}
              >
                <Col span={8}>
                  <p>Loại dịch vụ</p>
                  <Select
                    placeholder="Chọn dịch vụ"
                    style={{ width: "100%" }}
                    value={item.MaLoaiDV}
                    onChange={(val) => handleItemChange(index, "MaLoaiDV", val)}
                  >
                    {serviceTypes.map((t) => (
                      <Select.Option key={t.MaLoaiDV} value={t.MaLoaiDV}>
                        {t.TenLoaiDV}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={3}>
                  <p>Số lượng</p>
                  <InputNumber
                    min={1}
                    value={item.SoLuong}
                    onChange={(val) => handleItemChange(index, "SoLuong", val)}
                    placeholder="SL"
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={4}>
                  <p>Đơn giá</p>
                  <InputNumber
                    value={item.DonGiaDuocTinh}
                    disabled
                    formatter={(val) =>
                      `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={4}>
                  <p>Tổng tiền</p>
                  <InputNumber
                    value={item.ThanhTien}
                    disabled
                    formatter={(val) =>
                      `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={4}>
                  <p>Trả trước</p>
                  <InputNumber
                    value={item.TraTruoc}
                    onChange={(val) => handleItemChange(index, "TraTruoc", val)}
                    placeholder="Trả trước"
                    formatter={(val) =>
                      `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col span={1}>
                  <br></br>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemoveItem(index)}
                  />
                </Col>
              </Row>
            ))}
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="TongTien" label="Tổng tiền">
                <InputNumber
                  style={{ width: "100%" }}
                  readOnly
                  formatter={(val) =>
                    `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="TongTienTraTruoc" label="Tổng trả trước">
                <InputNumber
                  style={{ width: "100%" }}
                  readOnly
                  formatter={(val) =>
                    `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="TongTienConLai" label="Còn lại">
                <InputNumber
                  style={{ width: "100%", color: "red", fontWeight: "bold" }}
                  readOnly
                  formatter={(val) =>
                    `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* DETAIL MODAL - Updated Footer */}
      <Modal
        title="Chi tiết phiếu"
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />}>
            In phiếu
          </Button>,
          // Group Select và Button Cập nhật
          <div key="status-controls" style={{ display: 'inline-flex', gap: 8, margin: '0 8px' }}>
            <Select 
              value={targetStatus}
              onChange={setTargetStatus}
              style={{ width: 140, textAlign: 'left' }}
              options={[
                { value: "Đang xử lý", label: "Đang xử lý" },
                { value: "Hoàn thành", label: "Hoàn thành" },
                { value: "Đã giao", label: "Đã giao" },
                { value: "Đã hủy", label: "Đã hủy" },
              ]}
            />
            <Button
              key="update-btn"
              type="primary"
              onClick={handleUpdateStatus}
              // Disable nút cập nhật nếu chưa chọn status hoặc status không đổi
              disabled={!targetStatus || targetStatus === selectedTicket?.ticket?.TinhTrang}
            >
              Cập nhật
            </Button>
          </div>,
          <Button key="close" onClick={() => setIsDetailOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedTicket && (
          <div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Số phiếu">
                {selectedTicket.ticket.SoPhieuDV}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày lập">
                {new Date(selectedTicket.ticket.NgayLap).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedTicket.ticket.TenKH}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {selectedTicket.ticket.SoDienThoai}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <Tag color={getStatusColor(selectedTicket.ticket.TinhTrang)}>
                  {selectedTicket.ticket.TinhTrang}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <br />
            <Table
              dataSource={selectedTicket.items}
              pagination={false}
              columns={[
                { title: "Dịch vụ", dataIndex: "TenLoaiDV" },
                { title: "SL", dataIndex: "SoLuong" },
                {
                  title: "Đơn giá",
                  dataIndex: "DonGiaDuocTinh",
                  render: (val) => formatCurrency(val),
                },
                {
                  title: "Thành tiền",
                  dataIndex: "ThanhTien",
                  render: (val) => formatCurrency(val),
                },
                {
                  title: "Trả trước",
                  dataIndex: "TraTruoc",
                  render: (val) => formatCurrency(val),
                },
              ]}
              rowKey="MaChiTietDV"
            />
            <div style={{ textAlign: "right", marginTop: 10 }}>
              <h3>
                Tổng còn lại phải thanh toán:{" "}
                {formatCurrency(selectedTicket.ticket.TongTienConLai)}
              </h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceTicket;