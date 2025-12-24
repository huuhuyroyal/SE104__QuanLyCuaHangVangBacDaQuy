import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  Row,
  Col,
  message,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getInvoicesService,
  createInvoiceService,
  updateInvoiceService,
  deleteInvoicesService,
  getInvoiceByIdService,
} from "../../services/invoiceService";
import getAllProductsService from "../../services/productService";
import getAllCustomersService from "../../services/customerService";
import "./SalesInvoice.css";
import { checkActionPermission } from "../../utils/checkRole";

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductsKeys, setSelectedProductsKeys] = useState([]);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportInvoice, setExportInvoice] = useState(null);
  const [duplicateInvoice, setDuplicateInvoice] = useState(false);
  const [customerTempName, setCustomerTempName] = useState("");
  const [customerTempId, setCustomerTempId] = useState("");
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerKey, setSelectedCustomerKey] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchInvoices = async (q) => {
    setLoading(true);
    try {
      const res = await getInvoicesService(q);

      if (res && res.data) setInvoices(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const toDateYMD = (d) => {
    const date = d ? new Date(d) : new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const formatVND = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("vi-VN").format(n) + " đ";
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      fetchInvoices();
    } else {
      try {
        fetchInvoices(value);
      } catch (err) {}
    }
  };

  const openCreate = () => {
    if (!checkActionPermission(["seller"], false)) {
      return message.error("Liên hệ người bán hàng để tạo phiếu bán");
    }
    setEditing(null);
    form.resetFields();
    setItems([]);
    setSelectedCustomer(null);
    setSelectedCustomerKey(null);
    setDuplicateInvoice(false);
    // set NgayLap default to today's date (YYYY-MM-DD)
    form.setFieldsValue({ NgayLap: toDateYMD(new Date()) });
    setVisible(true);
  };

  const checkDuplicateSoPhieu = async (value) => {
    if (!value || !value.trim()) {
      setDuplicateInvoice(false);
      return;
    }
    try {
      const res = await getInvoiceByIdService(value.trim());
      const has = res && res.data && res.data.invoice;
      setDuplicateInvoice(!!has && !editing ? true : false);
    } catch (err) {
      setDuplicateInvoice(false);
    }
  };

  const openEdit = async (record) => {
    if (!checkActionPermission(["seller"], false)) {
      return message.error("Liên hệ người bán hàng để sửa phiếu bán");
    }
    try {
      const res = await getInvoiceByIdService(record.SoPhieuBH);
      if (res && res.data) {
        const { invoice, items } = res.data;
        // set NgayLap as date-only (YYYY-MM-DD) for the input
        const ngay =
          invoice && invoice.NgayLap
            ? toDateYMD(invoice.NgayLap)
            : toDateYMD(new Date());
        form.setFieldsValue({
          SoPhieuBH: invoice.SoPhieuBH,
          NgayLap: ngay,
          MaKH: invoice.MaKH,
          TenKH: invoice.TenKH,
          TongTien: invoice.TongTien,
        });
        setSelectedCustomer(
          invoice.MaKH ? { MaKH: invoice.MaKH, TenKH: invoice.TenKH } : null
        );
        setSelectedCustomerKey(invoice.MaKH || null);
        // augment items with product stock and image/pricing if available
        let augmented = items || [];
        try {
          const prodRes = await getAllProductsService();
          if (prodRes && prodRes.data) {
            const map = new Map(prodRes.data.map((p) => [p.MaSanPham, p]));
            augmented = augmented.map((it) => {
              const p = map.get(it.MaSanPham) || {};
              return {
                ...it,
                TenSanPham: it.TenSanPham || p.TenSanPham || "",
                HinhAnh: it.HinhAnh || p.HinhAnh,
                DonGiaBan: it.DonGiaBan || p.DonGiaBanRa || p.DonGiaBan || 0,
                SoLuongTon: p.SoLuongTon || it.SoLuongTon || 0,
              };
            });
          }
        } catch (err) {
          // ignore product enrichment errors
        }
        setItems(augmented);
        setEditing(invoice.SoPhieuBH);
        setVisible(true);
      }
    } catch (err) {}
  };

  const openProductSelector = async () => {
    try {
      const res = await getAllProductsService();
      if (res && res.data) {
        setProductsList(res.data);
        setProductsModalVisible(true);
      }
    } catch (err) {}
  };

  const addSelectedProducts = () => {
    const selected = productsList.filter((p) =>
      selectedProductsKeys.includes(p.MaSanPham)
    );
    const newItems = [...items];
    selected.forEach((p) => {
      const exists = newItems.find((it) => it.MaSanPham === p.MaSanPham);
      if (!exists) {
        newItems.push({
          MaChiTietBH: `CT${Date.now()}${Math.floor(Math.random() * 1000)}`,
          MaSanPham: p.MaSanPham,
          TenSanPham: p.TenSanPham,
          HinhAnh: p.HinhAnh,
          SoLuongBan: 1,
          DonGiaBan: p.DonGiaBanRa || p.DonGiaBan || 0,
          ThanhTien: Number(p.DonGiaBanRa || p.DonGiaBan || 0),
          SoLuongTon: p.SoLuongTon || 0,
        });
      }
    });
    setItems(newItems);
    setProductsModalVisible(false);
    setSelectedProductsKeys([]);
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    // enforce stock limit when changing quantity
    if (key === "SoLuongBan") {
      const desired = Number(value || 0);
      const stock = Number(newItems[index].SoLuongTon || 0);
      if (stock && desired > stock) {
        message.error(`Số lượng không được vượt quá tồn kho (${stock})`);
        newItems[index][key] = stock;
      } else {
        newItems[index][key] = desired;
      }
    } else {
      newItems[index][key] = value;
    }
    newItems[index].ThanhTien =
      (newItems[index].SoLuongBan || 0) * (newItems[index].DonGiaBan || 0);
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calcTotal = () => {
    return items.reduce((s, it) => s + (Number(it.ThanhTien) || 0), 0);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // ensure NgayLap is a full datetime string; if user provided YYYY-MM-DD, append time
      let ngayLapPayload = values.NgayLap;
      if (ngayLapPayload && /^\d{4}-\d{2}-\d{2}$/.test(ngayLapPayload)) {
        ngayLapPayload = `${ngayLapPayload} 00:00:00`;
      } else if (!ngayLapPayload) {
        ngayLapPayload = toDateYMD(new Date()) + " 00:00:00";
      }

      const payload = {
        SoPhieuBH: values.SoPhieuBH,
        NgayLap: ngayLapPayload,
        MaKH: values.MaKH || form.getFieldValue("MaKH"),
        TongTien: calcTotal(),
        items: items.map((it) => ({ ...it })),
      };
      if (duplicateInvoice && !editing) {
        message.error("Mã này đã tồn tại");
        return;
      }
      console.log(" Gửi payload:", payload);
      // validate quantities against stock
      const over = items.find(
        (it) =>
          (Number(it.SoLuongTon) || 0) > 0 &&
          Number(it.SoLuongBan || 0) > Number(it.SoLuongTon || 0)
      );
      if (over) {
        message.error(
          `Sản phẩm ${over.TenSanPham || over.MaSanPham} vượt quá tồn kho (${
            over.SoLuongTon
          })`
        );
        return;
      }
      if (editing) {
        await updateInvoiceService(payload);
        message.success("Cập nhật phiếu thành công");
      } else {
        await createInvoiceService(payload);
        message.success("Thêm phiếu thành công");
      }
      setVisible(false);
      fetchInvoices();
    } catch (err) {
      console.error("❌ Lỗi:", err);
      const serverMsg = err?.response?.data?.message;
      message.error(
        "Lỗi: " + (serverMsg || err.message || "Không thể lưu phiếu")
      );
    }
  };

  const handleDelete = async (record) => {
    if (!checkActionPermission(["admin"], false)) {
      return message.error("Liên hệ admin để xóa phiếu bán");
    }
    try {
      await deleteInvoicesService([record.SoPhieuBH]);
      fetchInvoices();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  const handleBulkDelete = async () => {
    if (!checkActionPermission(["admin"], false)) {
      return message.error("Liên hệ admin để xóa phiếu bán");
    }
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    try {
      const res = await deleteInvoicesService(selectedRowKeys);
      if (res && res.errCode === 0) {
        message.success(
          res.message || `Đã xóa ${selectedRowKeys.length} phiếu`
        );
      } else {
        message.error(res.message || "Xóa không thành công");
      }
      setSelectedRowKeys([]);
      fetchInvoices();
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const showBulkDeleteConfirm = () => {
    if (!checkActionPermission(["admin"], false)) {
      return message.error("Liên hệ admin để xóa phiếu bán");
    }
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} phiếu đã chọn?`,
      okText: "Có",
      cancelText: "Không",
      centered: true,
      onOk: () => handleBulkDelete(),
    });
  };

  const handlePrint = (record) => {
    // simple printable invoice
    const w = window.open("", "_blank");
    const inv = invoices.find((i) => i.SoPhieuBH === record.SoPhieuBH);
    const rowsHtml =
      items && items.length > 0
        ? items
            .map(
              (it, idx) =>
                `<tr><td>${idx + 1}</td><td>${
                  it.TenSanPham || it.MaSanPham
                }</td><td>${it.SoLuongBan}</td><td>${Number(
                  it.DonGiaBan || 0
                ).toLocaleString()} đ</td><td>${Number(
                  it.ThanhTien || 0
                ).toLocaleString()} đ</td></tr>`
            )
            .join("")
        : "<tr><td colspan=5>Không có chi tiết</td></tr>";

    const html = `
      <html>
      <head>
      <title>Phiếu bán hàng ${record.SoPhieuBH}</title>
      <style>
        body{font-family: Arial; padding:20px}
        table{width:100%; border-collapse: collapse}
        td,th{border:1px solid #000; padding:6px}
        .header{display:flex; justify-content:space-between; margin-bottom:10px}
      </style>
      </head>
      <body>
        <div class="header"><h2>PHIẾU BÁN HÀNG</h2><div>Mã: ${
          record.SoPhieuBH
        }<br/>Ngày: ${new Date(record.NgayLap).toLocaleDateString(
      "vi-VN"
    )}</div></div>
        <div>Khách hàng: ${record.TenKH || record.MaKH || ""}</div>
        <br/>
        <table>
          <thead>
            <tr><th>Stt</th><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <h3 style="text-align:right">Tổng: ${formatVND(record.TongTien)}</h3>
      </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
    }, 500);
  };

  const showExport = async (record) => {
    try {
      const res = await getInvoiceByIdService(record.SoPhieuBH);
      if (res && res.data) {
        const { invoice, items } = res.data;
        // Backend now returns TenLoaiSanPham and TenDVT via JOINs, no need to re-fetch products
        const augmented = (items || []).map((it) => ({
          ...it,
          TenLoaiSanPham: it.TenLoaiSanPham || "",
          TenDVT: it.TenDVT || "",
        }));
        setExportInvoice({ invoice, items: augmented });
        setExportModalVisible(true);
      } else {
        message.error("Không lấy được chi tiết phiếu");
      }
    } catch (err) {
      message.error("Lỗi khi lấy chi tiết phiếu");
    }
  };

  const handleBulkExport = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    if (selectedRowKeys.length > 1) {
      message.error("Vui lòng chọn 1 phiếu để xuất");
      return;
    }
    const record = invoices.find((inv) => inv.SoPhieuBH === selectedRowKeys[0]);
    if (record) showExport(record);
  };

  const openDetail = async (record) => {
    setDetailLoading(true);
    try {
      const res = await getInvoiceByIdService(record.SoPhieuBH);
      if (res && res.data && res.data.invoice) {
        setDetailInvoice(res.data.invoice);
        setDetailItems(res.data.items || []);
        setDetailModalVisible(true);
      } else {
        message.error("Không tìm thấy chi tiết phiếu");
      }
    } catch (err) {
      message.error("Lỗi tải chi tiết phiếu");
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "SoPhieuBH", key: "SoPhieuBH" },
    {
      title: "Ngày lập",
      dataIndex: "NgayLap",
      key: "NgayLap",
      render: (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : ""),
    },
    { title: "Khách hàng", dataIndex: "TenKH", key: "TenKH" },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      key: "TongTien",
      render: (v) => (v ? formatVND(v) : ""),
    },
    {
      title: "",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openDetail(record)}>
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            size="small"
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="main">
      <header className="Unit-header">
        <Input.Search
          placeholder="Tìm kiếm theo mã phiếu hoặc khách hàng..."
          onChange={handleSearchChange}
          value={search}
        />

        <div className="add-section">
          <Button
            type="default"
            disabled={selectedRowKeys.length === 0}
            onClick={handleBulkExport}
            icon={<ExportOutlined />}
          >
            Xuất file
          </Button>
          <Button
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={showBulkDeleteConfirm}
            icon={<DeleteOutlined />}
          >
            Xóa
            {selectedRowKeys.length > 0 ? ` (${selectedRowKeys.length})` : ""}
          </Button>
          <Button
            type="primary"
            onClick={openCreate}
            icon={<PlusOutlined />}
            className="add-product"
          >
            Tạo mới
          </Button>
        </div>
      </header>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total) => `${total} phiếu`,
        }}
        dataSource={invoices}
        rowKey="SoPhieuBH"
        columns={columns}
        loading={loading}
      />

      <Modal
        open={visible}
        title={editing ? `Chỉnh sửa ${editing}` : "Tạo phiếu bán"}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
        cancelText="Hủy"
        okText={"Lưu"}
        width={900}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="MaKH" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="TenKH" hidden>
            <Input />
          </Form.Item>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="SoPhieuBH"
                label="Mã phiếu"
                rules={[{ required: true, message: "Vui lòng nhập mã phiếu" }]}
                validateStatus={!editing && duplicateInvoice ? "error" : ""}
                help={!editing && duplicateInvoice ? "Mã này đã tồn tại" : ""}
              >
                <Input
                  disabled={!!editing}
                  onChange={(e) => {
                    const value = e.target.value;
                    form.setFieldsValue({ SoPhieuBH: value });
                    if (!editing) checkDuplicateSoPhieu(value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="NgayLap" label="Ngày lập">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8} style={{ marginTop: 8 }}>
            <Col span={24} style={{ marginBottom: 8 }}>
              <Button
                onClick={async () => {
                  const currentName = form.getFieldValue("TenKH") || "";
                  const currentId = form.getFieldValue("MaKH") || "";
                  setCustomerTempName(currentName);
                  setCustomerTempId(currentId);
                  setSelectedCustomerKey(currentId || null);
                  try {
                    const res = await getAllCustomersService();
                    if (res && res.data) setCustomersList(res.data);
                  } catch (err) {
                    console.error("Failed to load customers", err);
                  }
                  setCustomerModalVisible(true);
                }}
              >
                Thêm khách hàng
              </Button>
            </Col>
            <Col span={24}>
              <Form.Item name="MaKH" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="TenKH" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Table
                dataSource={
                  selectedCustomer
                    ? [
                        {
                          key: selectedCustomer.MaKH || "selected",
                          ...selectedCustomer,
                        },
                      ]
                    : []
                }
                pagination={false}
                columns={[
                  { title: "Mã KH", dataIndex: "MaKH", key: "MaKH" },
                  { title: "Tên khách hàng", dataIndex: "TenKH", key: "TenKH" },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: () => (
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          form.setFieldsValue({ MaKH: "", TenKH: "" });
                          setSelectedCustomer(null);
                          setSelectedCustomerKey(null);
                        }}
                        disabled={!selectedCustomer}
                      >
                        Xóa
                      </Button>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>

          <div className="items-section">
            <h4>Chi tiết hàng</h4>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <Button onClick={openProductSelector}>Chọn sản phẩm</Button>
            </div>
            <div className="items-grid">
              {items.map((it, idx) => (
                <div className="item-card" key={it.MaChiTietBH || idx}>
                  <div className="item-left">
                    {(() => {
                      const src =
                        it.HinhAnh && it.HinhAnh !== "#"
                          ? it.HinhAnh
                          : "/no-image.png";
                      return (
                        <img
                          src={src}
                          alt={it.TenSanPham || it.MaSanPham}
                          onError={(e) => {
                            console.warn(
                              "Image failed to load:",
                              it.MaSanPham,
                              src
                            );
                            e.currentTarget.src = "/no-image.png";
                          }}
                        />
                      );
                    })()}
                  </div>
                  <div className="item-body">
                    <div className="item-title">
                      {it.TenSanPham || it.MaSanPham || "(Chưa chọn)"}
                    </div>
                    <div className="item-meta">
                      Đơn giá: {Number(it.DonGiaBan || 0).toLocaleString()} đ
                    </div>
                    <div className="item-meta">
                      Tồn kho: {Number(it.SoLuongTon || 0).toLocaleString()}
                    </div>
                    <div className="item-meta">
                      Thành tiền:{" "}
                      <b style={{ color: "#0066cc" }}>
                        {Number(it.ThanhTien || 0).toLocaleString()} đ
                      </b>
                    </div>
                    <div className="item-actions">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemChange(
                            idx,
                            "SoLuongBan",
                            Math.max(0, (it.SoLuongBan || 0) - 1)
                          );
                        }}
                      >
                        -
                      </Button>
                      <Input
                        style={{ width: 60, textAlign: "center" }}
                        value={it.SoLuongBan}
                        onChange={(e) =>
                          handleItemChange(
                            idx,
                            "SoLuongBan",
                            Number(e.target.value || 0)
                          )
                        }
                      />
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemChange(
                            idx,
                            "SoLuongBan",
                            (it.SoLuongBan || 0) + 1
                          );
                        }}
                      >
                        +
                      </Button>
                      <Button
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <b>Tổng: {formatVND(calcTotal())}</b>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết phiếu bán hàng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {detailLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            Đang tải...
          </div>
        ) : detailInvoice ? (
          <>
            <Descriptions
              bordered
              size="middle"
              column={2}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Mã phiếu">
                {detailInvoice.SoPhieuBH}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày lập">
                {detailInvoice.NgayLap
                  ? new Date(detailInvoice.NgayLap).toLocaleDateString("vi-VN")
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Mã KH">
                {detailInvoice.MaKH || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {detailInvoice.TenKH || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                {formatVND(detailInvoice.TongTien)}
              </Descriptions.Item>
            </Descriptions>

            <Table
              dataSource={detailItems}
              rowKey={(r, idx) =>
                r.MaChiTietBH || `${r.MaSanPham || ""}-${idx}`
              }
              pagination={false}
              columns={[
                {
                  title: "Mã SP",
                  dataIndex: "MaSanPham",
                  key: "MaSanPham",
                  align: "center",
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "TenSanPham",
                  key: "TenSanPham",
                  align: "center",
                },
                {
                  title: "Loại",
                  dataIndex: "TenLoaiSanPham",
                  key: "TenLoaiSanPham",
                  align: "center",
                },
                {
                  title: "ĐVT",
                  dataIndex: "TenDVT",
                  key: "TenDVT",
                  align: "center",
                },
                {
                  title: "Số lượng",
                  dataIndex: "SoLuongBan",
                  key: "SoLuongBan",
                  align: "center",
                },
                {
                  title: "Đơn giá",
                  dataIndex: "DonGiaBan",
                  key: "DonGiaBan",
                  align: "center",
                  render: (v) => (v ? formatVND(v) : ""),
                },
                {
                  title: "Thành tiền",
                  dataIndex: "ThanhTien",
                  key: "ThanhTien",
                  align: "center",
                  render: (v) => (v ? formatVND(v) : ""),
                },
              ]}
            />

            <div style={{ textAlign: "right", marginTop: 12, fontWeight: 600 }}>
              Tổng: {formatVND(detailInvoice.TongTien)}
            </div>
          </>
        ) : (
          <div style={{ padding: 16 }}>Không có dữ liệu phiếu bán hàng</div>
        )}
      </Modal>

      <Modal
        title="Chọn khách hàng"
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        onOk={() => {
          // if a customer was selected from list, use it; otherwise use typed values
          if (selectedCustomerKey) {
            const c = customersList.find(
              (cs) => cs.MaKH === selectedCustomerKey
            );
            if (c) {
              form.setFieldsValue({ MaKH: c.MaKH, TenKH: c.TenKH });
              setSelectedCustomer({ MaKH: c.MaKH, TenKH: c.TenKH });
            }
          } else {
            form.setFieldsValue({
              MaKH: customerTempId,
              TenKH: customerTempName,
            });
            if (customerTempId || customerTempName) {
              setSelectedCustomer({
                MaKH: customerTempId,
                TenKH: customerTempName,
              });
            }
          }
          setCustomerModalVisible(false);
          setSelectedCustomerKey(null);
        }}
        cancelText="Hủy"
        width={700}
      >
        <div>
          <div style={{ marginBottom: 8 }}>
            <Input
              placeholder="Tìm theo tên hoặc mã..."
              value={customerTempName}
              onChange={(e) => setCustomerTempName(e.target.value)}
            />
          </div>
          <Table
            dataSource={customersList.filter((c) => {
              const q = (customerTempName || "").toLowerCase();
              if (!q) return true;
              return (
                (c.TenKH && c.TenKH.toLowerCase().includes(q)) ||
                (c.MaKH && c.MaKH.toLowerCase().includes(q))
              );
            })}
            rowKey="MaKH"
            pagination={{ pageSize: 6 }}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedCustomerKey ? [selectedCustomerKey] : [],
              onChange: (keys) =>
                setSelectedCustomerKey(keys && keys.length ? keys[0] : null),
            }}
            columns={[
              { title: "Mã KH", dataIndex: "MaKH", key: "MaKH" },
              { title: "Tên khách", dataIndex: "TenKH", key: "TenKH" },
              { title: "SĐT", dataIndex: "SoDienThoai", key: "SoDienThoai" },
              { title: "Địa chỉ", dataIndex: "DiaChi", key: "DiaChi" },
            ]}
          />
        </div>
      </Modal>

      <Modal
        title="Chọn sản phẩm"
        open={productsModalVisible}
        onCancel={() => setProductsModalVisible(false)}
        onOk={addSelectedProducts}
        cancelText="Hủy"
        width={900}
        className="products-modal"
      >
        <Table
          dataSource={productsList}
          rowKey="MaSanPham"
          pagination={{ pageSize: 6 }}
          rowSelection={{
            selectedRowKeys: selectedProductsKeys,
            onChange: (keys) => setSelectedProductsKeys(keys),
          }}
          columns={[
            {
              title: "Hình",
              dataIndex: "HinhAnh",
              key: "HinhAnh",
              render: (v, record) => (
                <img
                  src={v || "/no-image.png"}
                  alt={record.TenSanPham}
                  onError={(e) => {
                    console.warn("Product image failed:", record.MaSanPham, v);
                    e.currentTarget.src = "/no-image.png";
                  }}
                />
              ),
            },
            { title: "Mã", dataIndex: "MaSanPham", key: "MaSanPham" },
            {
              title: "Tên sản phẩm",
              dataIndex: "TenSanPham",
              key: "TenSanPham",
            },
            {
              title: "Đơn giá",
              dataIndex: "DonGiaBanRa",
              key: "DonGiaBanRa",
              render: (v) => (v ? Number(v).toLocaleString() + " đ" : "N/A"),
            },
            { title: "Tồn kho", dataIndex: "SoLuongTon", key: "SoLuongTon" },
          ]}
        />
      </Modal>

      <Modal
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="export"
            type="primary"
            onClick={() => {
              message.success("Đã xuất file thành công!");
              setExportModalVisible(false);
            }}
          >
            Xuất file
          </Button>,
        ]}
      >
        {exportInvoice ? (
          <div style={{ fontFamily: "Times New Roman, serif", padding: 12 }}>
            <div
              style={{ border: "1px solid #000", padding: 8, marginTop: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h2 style={{ margin: 0 }}>PHIẾU BÁN HÀNG</h2>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #000",
                  marginTop: 8,
                  paddingTop: 8,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <div>
                      <b>Số phiếu:</b> {exportInvoice.invoice.SoPhieuBH}
                    </div>
                  </div>
                  <div>
                    <div>
                      <b>Ngày lập:</b>{" "}
                      {exportInvoice.invoice.NgayLap
                        ? new Date(
                            exportInvoice.invoice.NgayLap
                          ).toLocaleDateString("vi-VN")
                        : ""}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div>
                    <b>Khách hàng:</b>{" "}
                    {exportInvoice.invoice.TenKH ||
                      exportInvoice.invoice.MaKH ||
                      ""}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Stt
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Sản phẩm
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Loại sản phẩm
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Số lượng
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Đơn vị tính
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Đơn giá
                      </th>
                      <th style={{ border: "1px solid #000", padding: 6 }}>
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportInvoice.items && exportInvoice.items.length > 0 ? (
                      exportInvoice.items.map((it, idx) => (
                        <tr key={it.MaChiTietBH || idx}>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {it.TenSanPham || it.MaSanPham}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {it.TenLoaiSanPham || ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {it.SoLuongBan || 0}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {it.TenDVT || ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {Number(
                              it.DonGiaBan || it.DonGiaBanRa || 0
                            ).toLocaleString()}{" "}
                            đ
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              padding: 6,
                              textAlign: "center",
                            }}
                          >
                            {Number(it.ThanhTien || 0).toLocaleString()} đ
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            border: "1px solid #000",
                            padding: 6,
                            textAlign: "center",
                          }}
                        >
                          Không có chi tiết
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: 8 }}>
                  <b>
                    Tổng:{" "}
                    {formatVND(
                      exportInvoice.invoice.TongTien ||
                        exportInvoice.items.reduce(
                          (s, it) => s + (Number(it.ThanhTien) || 0),
                          0
                        )
                    )}
                  </b>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Đang tải...</div>
        )}
      </Modal>
    </div>
  );
};

export default SalesInvoice;
