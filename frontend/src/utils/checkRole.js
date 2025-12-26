import { message } from "antd";

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getUserData = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const setUserData = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => !!getAccessToken();

export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.Role : null;
};

export const ROLE_PERMISSIONS = {
  admin: "ALL",
  warehouse: [
    "/Dashboard", //xem
    "/ProductPage", //xem, tạo, sửa, xóa
    "/InventoryReport", //xem
    "/Unit", //xem, tạo, sửa
    "/SalesInvoice", //xem
    "/PurchaseOrder", //xem, tạo
    "/ProductType", //xem, tạo, sửa
    "/Profile", //xem, sửa
    "/Supplier", //xem, tạo, sửa, xóa
  ],
  seller: [
    "/Dashboard",
    "/ProductPage",
    "/Unit",
    "/SalesInvoice", //xem, tạo
    "/ProductType", //Xem
    "/ServiceType", //Xem
    "/ServiceTicket", //xem, tạo
    "/Customer", //xem, tạo, sửa, xóa
    "/Profile", //xem, sửa
    "/customer-detail/:id",
  ],
};

export const hasMenuAccess = (currentPath) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  if (userRole === "admin") return true;

  const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
  return allowedPaths.some((permission) => {
    if (permission === currentPath) return true;
    if (permission.includes("/:")) {
      const basePath = permission.split("/:")[0];
      return currentPath.startsWith(basePath);
    }

    return false;
  });
};

export const checkActionPermission = (allowedRoles, showMessage = true) => {
  const currentRole = getUserRole();

  if (!allowedRoles.includes(currentRole)) {
    if (showMessage) {
      message.error("Bạn không có quyền thực hiện chức năng này!");
    }
    return false;
  }
  return true;
};
