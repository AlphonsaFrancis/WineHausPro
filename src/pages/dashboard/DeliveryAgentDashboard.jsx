import React, { useEffect, useState } from "react";
import "./admindashboard.css";
import AdminNavbar from "../../components/AdminNavbar";
import Welcome from "./admin/Welcome";
import AllOrdersDashboard from "./admin/AllOrders";
import { useLocation } from "react-router-dom";
import DeliveryAgentSidebar from "../../components/DeliveryAgentSidebar";

function DeliveryAgentDashboard() {
  const location = useLocation();
  const path = location.pathname.split("/");
  const [selectedMenu, setSelectedMenu] = useState("welcome");

  useEffect(() => {
    if (path[path.length - 1] === "order-delivery") {
      setSelectedMenu("allOrders");
    }
  }, [location, path]);

  return (
    <div className="dashboard-main-container">
      <div className="sidebar-main-container">
        <DeliveryAgentSidebar setSelectedMenu={setSelectedMenu} />
      </div>
      <div className="content-container">
        <AdminNavbar />
        <div className="content">
          {selectedMenu === "welcome" ? (
            <Welcome />
          ) : selectedMenu === "allOrders" ? (
            <AllOrdersDashboard />
          ) : selectedMenu === "newOrders" ? (
            "New Orders"
          ) : (
            "No Data Found"
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryAgentDashboard;
