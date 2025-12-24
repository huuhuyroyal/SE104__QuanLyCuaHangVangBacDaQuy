import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import Logout from "../Logout/Logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Lấy thông tin đường dẫn hiện tại

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Hàm kiểm tra xem nút này có cần active không
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  //State quản lý đóng mở pop up
  const [showLogout, setShowLogout] = useState(false);
  //Hàm xử lý click
  const handleLogoutClick = () => {
    setShowLogout(true);
  };
  const handleLogoutConfirm = () => {
    setShowLogout(false);
    handleNavigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogout(false);
  };
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="Jewelry Logo" />
      </div>

      <nav className="menu">
        <ul>
          <li
            className={isActive("/Dashboard")}
            onClick={() => handleNavigate("/Dashboard")}
          >
            <img src="/dashboard.svg" alt="" />
            <span href="#">Dashboard</span>
          </li>
          <li
            className={isActive("/ProductPage")}
            onClick={() => handleNavigate("/ProductPage")}
          >
            <img src=" /ql_san_pham.svg" alt="" />
            <span href="#">Quản lý sản phẩm</span>
          </li>
          <li
            className={isActive("/InventoryReport")}
            onClick={() => handleNavigate("/InventoryReport")}
          >
            <img src="/bao_cao_ton_kho.svg" alt="" />
            <span href="#">Báo cáo tồn kho</span>
          </li>
          <li
            className={isActive("/Unit")}
            onClick={() => handleNavigate("/Unit")}
          >
            <img src="/ql_don_vi_tinh.svg" alt="" />
            <span href="#">Quản lý đơn vị tính</span>
          </li>
          <li
            className={isActive("/SalesInvoice")}
            onClick={() => handleNavigate("/SalesInvoice")}
          >
            <img src="/ql_phieu_ban_hang.svg" alt="" />
            <span href="#">Quản lý phiếu bán hàng</span>
          </li>
          <li
            className={isActive("/PurchaseOrder")}
            onClick={() => handleNavigate("/PurchaseOrder")}
          >
            <img src="/gio_hang.svg" alt="" />
            <span href="#">Quản lý phiếu mua hàng</span>
          </li>
          <li
            className={isActive("/Supplier")}
            onClick={() => handleNavigate("/Supplier")}
          >
            <img src="/qlkh.svg" alt="" />
            <span href="#">Quản lý nhà cung cấp</span>
          </li>
          <li
            className={isActive("/ProductType")}
            onClick={() => handleNavigate("/ProductType")}
          >
            <img src="/ql_san_pham.svg" alt="" />
            <span href="#">Quản lý loại sản phẩm</span>
          </li>
          <li
            className={isActive("/ServiceType")}
            onClick={() => handleNavigate("/ServiceType")}
          >
            <img src="/ql_loai_dich_vu.svg" alt="" />
            <span href="#">Quản lý loại dịch vụ</span>
          </li>
          <li
            className={isActive("/ServiceTicket")}
            onClick={() => handleNavigate("/ServiceTicket")}
          >
            <img src="/ql_phieu_dich_vu.svg" alt="" />
            <span href="#">Quản lý phiếu dịch vụ</span>
          </li>
          <li
            className={isActive("/Customer")}
            onClick={() => handleNavigate("/Customer")}
          >
            <img src="/qlkh.svg" alt="" />
            <span href="#">Quản lý khách hàng</span>
          </li>
          <li
            className={isActive("/Employee")}
            onClick={() => handleNavigate("/Employee")}
          >
            <img src="/ql_nhan_vien.svg" alt="" />
            <span href="#">Quản lý nhân viên</span>
          </li>
        </ul>
      </nav>

      <div className="user-section">
        <div className="profile">
          <img src="/ca_nhan.svg" alt="" />
          <span href="#">Cá nhân</span>
        </div>
        <div className="logout" onClick={handleLogoutClick}>
          <img src="/dang_xuat.svg" alt="" />
          <span href="#">Đăng xuất</span>
        </div>
        {showLogout && (
          <Logout
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
