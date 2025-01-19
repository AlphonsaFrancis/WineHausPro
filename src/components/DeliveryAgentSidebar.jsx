import React, { useState } from "react";
import "./sidebar.css";
import { RiArrowRightSFill, RiArrowDownSFill } from "react-icons/ri";

function DeliveryAgentSidebar({ setSelectedMenu }) {
  const [selectedMenu, setActiveMenu] = useState("");
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(true);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenu(menu);
  };

  return (
    <div className="sidebar-container">
      <div className="title">
        <span style={{ color: "green" }}>W</span>ineHaus
      </div>
      <div className="sidebar-menus">
        {/* Orders */}
        <div
          className="menu-title"
          onClick={() => setShowOrderSubmenu((prev) => !prev)}
        >
          <span>Orders</span>
          {showOrderSubmenu ? (
            <RiArrowDownSFill className="menu-icon" />
          ) : (
            <RiArrowRightSFill />
          )}
        </div>
        {showOrderSubmenu && (
          <>
            <div
              className={`menu-item ${
                selectedMenu === "allOrders" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("allOrders")}
            >
              All Orders
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryAgentSidebar;
