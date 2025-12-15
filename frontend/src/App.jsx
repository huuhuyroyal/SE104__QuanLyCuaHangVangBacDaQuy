// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import { routes } from "./routes";

function App() {
  console.log("Danh sách routes:", routes);
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => {
          const PageComponent = route.component;
          const isShowSidebar = route.isShowSidebar;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                isShowSidebar ? (
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
