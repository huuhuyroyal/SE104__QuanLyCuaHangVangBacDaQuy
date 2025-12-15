import Dashboard from "../page/Dashboard/Dashboard";
import ProductPage from "../page/ProductPage/ProductPage";
import InventionReport from "../page/InventoryReport/InventoryReport";
import Unit from "../page/Unit/Unit";
import LoginPage from "../page/Login/LoginPage";
import Title from "antd/es/skeleton/Title";

export const routes = [
  {
    path: "/",
    component: LoginPage,
    Title: "Login",
    isShowSidebar: false,
  },
  {
    path: "/Dashboard",
    component: Dashboard,
    Title: "Dashboard",
    isShowSidebar: true,
  },
  {
    path: "/ProductPage",
    component: ProductPage,
    Title: "Quản lý sản phẩm",
    isShowSidebar: true,
  },
  {
    path: "/InventoryReport",
    Title: "Báo cáo tồn kho",
    component: InventionReport,
    isShowSidebar: true,
  },
  {
    path: "/Unit",
    Title: "Quản lý đơn vị tính",
    component: Unit,
    isShowSidebar: true,
  },
];
