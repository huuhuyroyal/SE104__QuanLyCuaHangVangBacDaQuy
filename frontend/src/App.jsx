// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import { routes } from "./routes";
import ProtectedRoute from "./routes/protectedRoute.jsx";

function App() {
  console.log("Danh sách routes:", routes);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => {
          const PageComponent = route.component;
          const isShowSidebar = route.isShowSidebar;
          const isPublicPage = route.path === "/" || route.path === "/login";
          // Tạo giao diện
          const PageLayout = isShowSidebar ? (
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Header />
                <div className="page-content">
                  <PageComponent />
                </div>
              </div>
            </div>
          ) : (
            <PageComponent />
          );

          //Render
          return (
            <Route
              key={index}
              path={route.path}
              element={
                isPublicPage ? (
                  PageLayout
                ) : (
                  <ProtectedRoute path={route.path}>
                    {PageLayout}
                  </ProtectedRoute>
                )
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
