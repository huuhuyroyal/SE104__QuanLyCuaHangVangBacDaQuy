import Dashboard from "../page/Dashboard/Dashboard";
import ProductPage from "../page/ProductPage/ProductPage";
import InventionReport from "../page/InventoryReport/InventoryReport";
import Unit from "../page/Unit/Unit";
import LoginPage from "../page/Login/LoginPage";
<<<<<<< HEAD
import ProductType from "../page/ProductType/ProductType";
=======
import SalesInvoice from "../page/SalesInvoice/SalesInvoice";
import PurchaseInvoice from "../page/PurchaseInvoice/PurchaseInvoice";
>>>>>>> ad18d8c40aa5d7681666ad87b3174ae70b390e1c
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
];
