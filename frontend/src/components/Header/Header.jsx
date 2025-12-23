import React from "react";
import "./Header.css";
import { routes } from "../../routes";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute.Title;
  return (
    <div className="Heading">
      <h1>{title}</h1>
      <img src="#" alt="avt" />
    </div>
  );
};

export default Header;
