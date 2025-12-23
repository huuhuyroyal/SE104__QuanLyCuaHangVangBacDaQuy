import Dashboard from "../page/Dashboard/Dashboard";
import ProductPage from "../page/ProductPage/ProductPage";
import InventionReport from "../page/InventoryReport/InventoryReport";
import Unit from "../page/Unit/Unit";
import ListEmployee from "../page/ListEmployee/ListEmployee";
import ListCustomer from "../page/ListCustomer/ListCustomer";
import Profile from "../page/Profile/Profile";

export const routes = [
  {
    path: "/",
    component: Dashboard,
    title: "Dashboard",
    isShowSidebar: true,
  },
  {
    path: "/ProductPage",
    component: ProductPage,
    title: "Quản lý sản phẩm",
    isShowSidebar: true,
  },
  {
    path: "/InventoryReport",
    component: InventionReport,
    title: "Báo cáo tồn kho",
    isShowSidebar: true,
  },
  {
    path: "/Unit",
    component: Unit,
    title: "Quản lý đơn vị tính",
    isShowSidebar: true,
  },
  {
    path: "/ListEmployee",
    component: ListEmployee,
    title: "Quản lý nhân viên",
    isShowSidebar: true,
  },
  {
    path: "/ListCustomer",
    component: ListCustomer,
    title: "Quản lý khách hàng",
    isShowSidebar: true,
  },
  {
    path: "/Profile",
    component: Profile,
    title: "Thông tin cá nhân",
    isShowSidebar: true,
  },
];