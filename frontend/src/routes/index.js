import Dashboard from "../page/Dashboard/Dashboard";
import ProductPage from "../page/ProductPage/ProductPage";
import InventionReport from "../page/InventoryReport/InventoryReport";
import Unit from "../page/Unit/Unit";
import LoginPage from "../page/Login/LoginPage";
import ProductType from "../page/ProductType/ProductType";
import SalesInvoice from "../page/SalesInvoice/SalesInvoice";
import PurchaseInvoice from "../page/PurchaseInvoice/PurchaseInvoice";
import SupplierPage from "../page/Supplier/Supplier";
import ServiceType from "../page/ServiceType/ServiceType";
import ServiceTicket from "../page/ServiceTicket/ServiceTicket";
import ListCustomer from "../page/ListCustomer/ListCustomer";
import DetailCustomer from "../page/DetailCustomer/DetailCustomer";
import ListEmployee from "../page/ListEmployee/ListEmployee";
import DetailEmployee from "../page/DetailEmployee/DetailEmployee";

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
    path: "/SalesInvoice",
    Title: "Quản lý phiếu bán hàng",
    component: SalesInvoice,
    isShowSidebar: true,
  },
  {
    path: "/PurchaseOrder",
    Title: "Quản lý phiếu mua hàng",
    component: PurchaseInvoice,
    isShowSidebar: true,
  },
  {
    path: "/Supplier",
    Title: "Quản lý nhà cung cấp",
    component: SupplierPage,
    isShowSidebar: true,
  },
  {
    path: "/Unit",
    Title: "Quản lý đơn vị tính",
    component: Unit,
    isShowSidebar: true,
  },
  {
    path: "/ProductType",
    Title: "Quản lý loại sản phẩm",
    component: ProductType,
    isShowSidebar: true,
  },
  {
    path: "/ServiceType",
    Title: "Quản lý loại dịch vụ",
    component: ServiceType,
    isShowSidebar: true,
  },
  {
    path: "/ServiceTicket",
    Title: "Quản lý phiếu dịch vụ",
    component: ServiceTicket,
    isShowSidebar: true,
  },
  {
    path: "/customer-detail/:id",
    component: DetailCustomer,
    Title: "Chi tiết khách hàng",
    isShowSidebar: true,
  },
  {
    path: "/ListCustomer",
    component: ListCustomer,
    Title: "Quản lý khách hàng",
    isShowSidebar: true,
  },
  {
    path: "/ListEmployee",
    component: ListEmployee,
    Title: "Quản lý nhân viên",
    isShowSidebar: true,
  },
  {
    path: "/employee-detail/:id",
    component: DetailEmployee,
    Title: "Chi tiết nhân viên",
    isShowSidebar: true,
  },
  {
    // alias route kept for backward-compatibility
    path: "/Customer",
    component: ListCustomer,
    Title: "Quản lý khách hàng",
    isShowSidebar: true,
  },
];
