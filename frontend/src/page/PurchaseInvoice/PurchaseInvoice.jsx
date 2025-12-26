import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  getPurchasesService,
  createPurchaseService,
  deletePurchasesService,
  getPurchaseByIdService,
} from "../../services/purchaseService";
import supplierService from "../../services/supplierService";
import getAllProductsService from "../../services/productService";
import "./PurchaseInvoice.css";
import { checkActionPermission } from "../../utils/checkRole";

const PurchaseInvoice = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [selectedProductsKeys, setSelectedProductsKeys] = useState([]);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [selectedSupplierKey, setSelectedSupplierKey] = useState(null);
  const [supplierTempName, setSupplierTempName] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportPurchase, setExportPurchase] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const formatVND = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("vi-VN").format(n) + " đ";
  };

  const toDateYMD = (d) => {
    const date = d ? new Date(d) : new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierService.getSuppliers();
      if (res && res.data) setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchases = async (q) => {
    setLoading(true);
    try {
      const res = await getPurchasesService(q);
      if (res && res.data) setPurchases(res.data);
    } catch (err) {
      message.error("Lỗi tải phiếu mua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchPurchases();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchPurchases(value.trim());
  };

  const openCreate = () => {
    if (!checkActionPermission(["warehouse"], false)) {
      return message.error("Liên hệ với Thủ kho để tạo phiếu mua hàng");
    }
    setEditing(null);
    setItems([]);
    form.resetFields();
    form.setFieldsValue({ NgayLap: toDateYMD(new Date()) });
    setSelectedSupplier(null);
    setVisible(true);
  };

  const openProductSelector = async () => {
    try {
      const res = await getAllProductsService();
      if (res && res.data) {
        setProductsList(res.data);
        setProductsModalVisible(true);
      }
    } catch (err) {
      message.error("Lỗi tải sản phẩm");
    }
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
          MaChiTietMH: `CTMH${Date.now()}${Math.floor(Math.random() * 1000)}`,
          MaSanPham: p.MaSanPham,
          TenSanPham: p.TenSanPham,
          HinhAnh: p.HinhAnh,
          SoLuongMua: 1,
          DonGiaMua: p.DonGiaMua,
          ThanhTien: Number(p.DonGiaMua),
        });
      }
    });
    setItems(newItems);
    setProductsModalVisible(false);
    setSelectedProductsKeys([]);
  };

  const handleItemChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    newItems[index].ThanhTien =
      (newItems[index].SoLuongMua || 0) * (newItems[index].DonGiaMua || 0);
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
      const payload = {
        SoPhieuMH: values.SoPhieuMH,
        NgayLap: values.NgayLap,
        MaNCC: values.MaNCC,
        TongTien: calcTotal(),
        items: items.map((it) => ({ ...it })),
      };

      await createPurchaseService(payload);
      message.success("Tạo phiếu mua thành công");

      setVisible(false);
      fetchPurchases(search.trim());
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      if (err?.response?.status === 409) {
        message.error("Mã phiếu đã tồn tại");
      } else if (!err?.errorFields) {
        message.error(msg || "Lỗi lưu phiếu mua");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    try {
      const res = await deletePurchasesService(selectedRowKeys);
      if (res && res.errCode === 0) {
        message.success(res.message || "Đã xóa");
      } else {
        message.error(res.message || "Xóa không thành công");
      }
      setSelectedRowKeys([]);
      fetchPurchases(search.trim());
    } catch (err) {
      message.error("Lỗi khi xóa");
    }
  };

  const showExport = async (record) => {
    try {
      const res = await getPurchaseByIdService(record.SoPhieuMH);
      if (res && res.data && res.data.purchase) {
        setExportPurchase(res.data);
        setExportModalVisible(true);
      } else {
        message.error("Không lấy được chi tiết phiếu");
      }
    } catch (err) {
      message.error("Lỗi khi lấy chi tiết phiếu");
    }
  };

  const openDetail = async (record) => {
    setDetailLoading(true);
    try {
      const res = await getPurchaseByIdService(record.SoPhieuMH);
      if (res && res.data && res.data.purchase) {
        setDetailPurchase(res.data.purchase);
        setDetailItems(res.data.items || []);
        setDetailModalVisible(true);
      } else {
        message.error("Không lấy được chi tiết phiếu");
      }
    } catch (err) {
      message.error("Lỗi khi lấy chi tiết phiếu");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBulkExport = () => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) return;
    if (selectedRowKeys.length > 1) {
      message.error("Vui lòng chọn 1 phiếu để xuất");
      return;
    }
    const record = purchases.find((p) => p.SoPhieuMH === selectedRowKeys[0]);
    if (record) showExport(record);
  };

  const showBulkDeleteConfirm = () => {
    if (!checkActionPermission(["admin"], false)) {
      return message.error("Liên hệ với admin để xóa phiếu mua hàng");
    }
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} phiếu mua đã chọn?`,
      okText: "Có",
      cancelText: "Không",
      centered: true,
      onOk: () => handleBulkDelete(),
    });
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "SoPhieuMH", key: "SoPhieuMH" },
    {
      title: "Ngày lập",
      dataIndex: "NgayLap",
      key: "NgayLap",
      render: (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : ""),
    },
    { title: "Nhà cung cấp", dataIndex: "TenNCC", key: "TenNCC" },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      key: "TongTien",
      render: (v) => (v ? formatVND(v) : ""),
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="small" onClick={() => openDetail(record)}>
            Xem
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="main">
      <header className="Unit-header">
        <Input.Search
          placeholder="Tìm kiếm theo mã phiếu hoặc nhà cung cấp..."
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
            icon={<PlusOutlined />}
            onClick={openCreate}
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
        dataSource={purchases}
        rowKey="SoPhieuMH"
        columns={columns}
        loading={loading}
      />

      <Modal
        open={visible}
        title={editing ? `Chỉnh sửa ${editing}` : "Tạo phiếu mua"}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
        cancelText="Hủy"
        okText={editing ? "Lưu" : "Thêm"}
        width={900}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="SoPhieuMH"
                label="Mã phiếu"
                rules={[{ required: true, message: "Vui lòng nhập mã phiếu" }]}
              >
                <Input disabled={!!editing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="NgayLap"
                label="Ngày lập"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8} style={{ marginTop: 8 }}>
            <Col span={24} style={{ marginBottom: 8 }}>
              <Button
                onClick={async () => {
                  const currentName = form.getFieldValue("TenNCC") || "";
                  setSupplierTempName(currentName);
                  try {
                    const res = await supplierService.getSuppliers();
                    if (res && res.data) setSuppliers(res.data);
                  } catch (err) {
                    console.error("Failed to load suppliers", err);
                  }
                  setSupplierModalVisible(true);
                }}
              >
                Thêm nhà cung cấp
              </Button>
            </Col>
            <Col span={24}>
              <Form.Item name="MaNCC" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="TenNCC" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Table
                dataSource={
                  selectedSupplier
                    ? [
                        {
                          key: selectedSupplier.MaNCC || "selected",
                          ...selectedSupplier,
                        },
                      ]
                    : []
                }
                pagination={false}
                columns={[
                  { title: "Mã NCC", dataIndex: "MaNCC", key: "MaNCC" },
                  { title: "Tên NCC", dataIndex: "TenNCC", key: "TenNCC" },
                  {
                    title: "Thao tác",
                    key: "action",
                    render: () => (
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          form.setFieldsValue({ MaNCC: "", TenNCC: "" });
                          setSelectedSupplier(null);
                        }}
                        disabled={!selectedSupplier}
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
                <div className="item-card" key={it.MaChiTietMH || idx}>
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
                      Đơn giá mua:
                      <InputNumber
                        min={0}
                        style={{ width: 140, marginLeft: 8 }}
                        value={it.DonGiaMua}
                        onChange={(val) =>
                          handleItemChange(idx, "DonGiaMua", Number(val || 0))
                        }
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/,/g, "")}
                      />
                    </div>
                    <div className="item-meta" style={{ marginTop: 6 }}>
                      Số lượng:
                      <InputNumber
                        min={0}
                        style={{ width: 120, marginLeft: 8 }}
                        value={it.SoLuongMua}
                        onChange={(val) =>
                          handleItemChange(idx, "SoLuongMua", Number(val || 0))
                        }
                      />
                    </div>
                    <div className="item-meta" style={{ marginTop: 6 }}>
                      Thành tiền:{" "}
                      <b style={{ color: "#0066cc" }}>
                        {Number(it.ThanhTien || 0).toLocaleString()} đ
                      </b>
                    </div>
                    <div className="item-actions" style={{ marginTop: 8 }}>
                      <Button
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
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
        open={productsModalVisible}
        title="Chọn sản phẩm"
        onCancel={() => setProductsModalVisible(false)}
        onOk={addSelectedProducts}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <Table
          rowSelection={{
            selectedRowKeys: selectedProductsKeys,
            onChange: (keys) => setSelectedProductsKeys(keys),
          }}
          dataSource={productsList}
          rowKey="MaSanPham"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: "Mã", dataIndex: "MaSanPham", key: "MaSanPham" },
            {
              title: "Tên sản phẩm",
              dataIndex: "TenSanPham",
              key: "TenSanPham",
            },
            {
              title: "Đơn giá",
              dataIndex: "DonGiaMuaVao",
              key: "DonGiaMuaVao",
              render: (v) => (v ? Number(v).toLocaleString() + " đ" : "N/A"),
            },
          ]}
        />
      </Modal>
      <Modal
        title="Chọn nhà cung cấp"
        open={supplierModalVisible}
        onCancel={() => setSupplierModalVisible(false)}
        onOk={() => {
          if (selectedSupplierKey) {
            const s = suppliers.find(
              (sup) => sup.MaNCC === selectedSupplierKey
            );
            if (s) {
              form.setFieldsValue({ MaNCC: s.MaNCC, TenNCC: s.TenNCC });
              setSelectedSupplier({ MaNCC: s.MaNCC, TenNCC: s.TenNCC });
            }
          }
          setSupplierModalVisible(false);
          setSelectedSupplierKey(null);
        }}
        cancelText="Hủy"
        width={700}
      >
        <div>
          <div style={{ marginBottom: 8 }}>
            <Input
              placeholder="Tìm theo tên hoặc mã..."
              value={supplierTempName}
              onChange={(e) => setSupplierTempName(e.target.value)}
            />
          </div>
          <Table
            dataSource={suppliers.filter((s) => {
              const q = (supplierTempName || "").toLowerCase();
              if (!q) return true;
              return (
                (s.TenNCC && s.TenNCC.toLowerCase().includes(q)) ||
                (s.MaNCC && s.MaNCC.toLowerCase().includes(q))
              );
            })}
            rowKey="MaNCC"
            pagination={{ pageSize: 6 }}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedSupplierKey ? [selectedSupplierKey] : [],
              onChange: (keys) =>
                setSelectedSupplierKey(keys && keys.length ? keys[0] : null),
            }}
            columns={[
              { title: "Mã NCC", dataIndex: "MaNCC", key: "MaNCC" },
              { title: "Tên nhà cung cấp", dataIndex: "TenNCC", key: "TenNCC" },
              { title: "SĐT", dataIndex: "SoDienThoai", key: "SoDienThoai" },
              { title: "Địa chỉ", dataIndex: "DiaChi", key: "DiaChi" },
            ]}
          />
        </div>
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
        {exportPurchase ? (
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
                  <h2 style={{ margin: 0 }}>PHIẾU MUA HÀNG</h2>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #000",
                  marginTop: 8,
                  paddingTop: 8,
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <b>Số phiếu:</b> {exportPurchase.purchase.SoPhieuMH}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <b>Ngày lập:</b>{" "}
                  {exportPurchase.purchase.NgayLap
                    ? new Date(
                        exportPurchase.purchase.NgayLap
                      ).toLocaleDateString("vi-VN")
                    : ""}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <b>Nhà cung cấp:</b>{" "}
                  {exportPurchase.purchase.TenNCC ||
                    exportPurchase.purchase.MaNCC ||
                    ""}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <b>Địa chỉ:</b> {exportPurchase.purchase.DiaChi || ""}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <b>SĐT:</b> {exportPurchase.purchase.SoDienThoai || ""}
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
                    {exportPurchase.items && exportPurchase.items.length > 0 ? (
                      exportPurchase.items.map((it, idx) => (
                        <tr key={it.MaChiTietMH || idx}>
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
                            {it.SoLuongMua || 0}
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
                            {Number(it.DonGiaMua || 0).toLocaleString()} đ
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
                      exportPurchase.purchase.TongTien ||
                        exportPurchase.items.reduce(
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

      <Modal
        title="Chi tiết phiếu mua hàng"
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
        ) : detailPurchase ? (
          <>
            <Descriptions
              bordered
              size="middle"
              column={2}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Mã phiếu">
                {detailPurchase.SoPhieuMH}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày lập">
                {detailPurchase.NgayLap
                  ? new Date(detailPurchase.NgayLap).toLocaleDateString("vi-VN")
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Mã NCC">
                {detailPurchase.MaNCC || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tên NCC">
                {detailPurchase.TenNCC || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {detailPurchase.DiaChi || ""}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT" span={2}>
                {detailPurchase.SoDienThoai || ""}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                {formatVND(
                  detailPurchase.TongTien ||
                    detailItems.reduce(
                      (s, it) => s + (Number(it.ThanhTien) || 0),
                      0
                    )
                )}
              </Descriptions.Item>
            </Descriptions>

            <Table
              dataSource={detailItems}
              rowKey={(r, idx) =>
                r.MaChiTietMH || `${r.MaSanPham || ""}-${idx}`
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
                  dataIndex: "SoLuongMua",
                  key: "SoLuongMua",
                  align: "center",
                },
                {
                  title: "Đơn giá",
                  dataIndex: "DonGiaMua",
                  key: "DonGiaMua",
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
              Tổng:{" "}
              {formatVND(
                detailPurchase.TongTien ||
                  detailItems.reduce(
                    (s, it) => s + (Number(it.ThanhTien) || 0),
                    0
                  )
              )}
            </div>
          </>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseInvoice;
