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
      <div className="app-container">
        <Sidebar />

        <div className="main-content">
          <Header />
          <Routes>
            {routes.map((route) => {
              const PageComponent = route.component;
              return <Route path={route.path} element={<PageComponent />} />;
            })}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
