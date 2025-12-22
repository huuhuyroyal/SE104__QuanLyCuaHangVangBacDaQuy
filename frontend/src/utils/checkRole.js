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
    "/Dashboard",
    "/ProductPage",
    "/InventoryReport",
    "/Unit",
    "/PurchaseOrder",
  ],
  seller: [
    "/Dashboard",
    "/ProductPage",
    "/SaleOrder",
    "/Customer",
    "/ServiceType",
    "/ServiceTicket",
  ],
};

export const hasMenuAccess = (path) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  if (userRole === "admin") return true;
  const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
  return allowedPaths.includes(path);
};

export const checkActionPermission = (allowedRoles) => {
  const currentRole = getUserRole();

  if (!allowedRoles.includes(currentRole)) {
    message.error(
      `Bạn không có quyền thực hiện chức năng này. Vai trò của bạn hiện tại đang là ${currentRole}`
    );
    return false;
  }
  return true;
};
