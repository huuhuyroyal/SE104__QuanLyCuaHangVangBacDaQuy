import React from "react";
import "./Header.css";
import { routes } from "../../routes";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const matchRoute = (routePath, pathname) => {
    if (!routePath) return false;
    if (routePath === pathname) return true;
    // handle simple param routes like /customer-detail/:id
    if (routePath.includes(':')) {
      const rp = routePath.split('/').filter(Boolean);
      const pp = pathname.split('/').filter(Boolean);
      if (rp.length !== pp.length) return false;
      return rp.every((seg, i) => seg.startsWith(':') || seg === pp[i]);
    }
    return false;
  };

  const currentRoute = routes.find((route) => matchRoute(route.path, location.pathname));
  const title = currentRoute && currentRoute.Title ? currentRoute.Title : '';

  return (
    <div className="Heading">
      <h1>{title}</h1>
    </div>
  );
};

export default Header;
