import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import Logout from "../Logout/Logout";
import { hasMenuAccess } from "../../utils/checkRole";

const MENU_ITEMS = [
  { path: "/Dashboard", label: "Dashboard", icon: "/dashboard.svg" },
  { path: "/ProductPage", label: "Quản lý sản phẩm", icon: "/ql_san_pham.svg" },
  {
    path: "/InventoryReport",
    label: "Báo cáo tồn kho",
    icon: "/bao_cao_ton_kho.svg",
  },
  { path: "/Unit", label: "Quản lý đơn vị tính", icon: "/ql_don_vi_tinh.svg" },
  {
    path: "/SalesInvoice",
    label: "Quản lý phiếu bán hàng",
    icon: "/ql_phieu_ban_hang.svg",
  },
  {
    path: "/PurchaseOrder",
    label: "Quản lý phiếu mua hàng",
    icon: "/gio_hang.svg",
  },
  {
    path: "/Supplier",
    label: "Quản lý nhà cung cấp",
    icon: "/ql_nha_cung_cap.png",
  },

  {
    path: "/ProductType",
    label: "Quản lý loại sản phẩm",
    icon: "/ql_san_pham.svg",
  },
  {
    path: "/ServiceType",
    label: "Quản lý loại dịch vụ",
    icon: "/ql_loai_dich_vu.svg",
  },
  {
    path: "/ServiceTicket",
    label: "Quản lý phiếu dịch vụ",
    icon: "/ql_phieu_dich_vu.svg",
  },
  { path: "/Customer", label: "Quản lý khách hàng", icon: "/qlkh.svg" },
  {
    path: "/ListEmployee",
    label: "Quản lý nhân viên",
    icon: "/ql_nhan_vien.svg",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname.toLowerCase() === path.toLowerCase()
      ? "active"
      : "";
  };

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
          {/* 3. Render danh sách menu động */}
          {MENU_ITEMS.map((item, index) => {
            // Logic lọc quyền: Nếu có quyền thì mới render ra màn hình
            if (hasMenuAccess(item.path)) {
              return (
                <li
                  key={index}
                  className={isActive(item.path)}
                  onClick={() => handleNavigate(item.path)}
                >
                  <img src={item.icon} alt="" />
                  <span>{item.label}</span>
                </li>
              );
            }
            return null; // Không có quyền -> Không hiện gì cả
          })}
        </ul>
      </nav>

      <div className="user-section">
        {/* Phần Profile cũng có thể check quyền nếu muốn, nhưng thường ai cũng được xem */}
        <div
          className={`profile ${isActive("/Profile")}`}
          onClick={() => handleNavigate("/Profile")}
        >
          <img src="/ca_nhan.svg" alt="" />
          <span>Cá nhân</span>
        </div>

        <div className="logout" onClick={handleLogoutClick}>
          <img src="/dang_xuat.svg" alt="" />
          <span>Đăng xuất</span>
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
