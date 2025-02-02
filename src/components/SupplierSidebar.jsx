
import React, { useState } from "react";
import "./sidebar.css";
import { RiArrowRightSFill, RiArrowDownSFill } from "react-icons/ri";

function SupplierSidebar({ setSelectedMenu }) {
  const [selectedMenu, setActiveMenu] = useState("");
  const [showProductSubmenu, setShowProductSubmenu] = useState(true);

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
        {/* Products */}
        <div className="menu-title" onClick={() => setShowProductSubmenu((prev) => !prev)}>
          <span>Products</span>
          {showProductSubmenu ? <RiArrowDownSFill className="menu-icon"  style={{fontSize:'16px'}}/> : <RiArrowRightSFill />}
        </div>
        {showProductSubmenu && (
          <>
            <div
              className={`menu-item ${selectedMenu === "allProducts" ? "active" : ""}`}
              onClick={() => handleMenuClick("allProducts")}
            >
              All Products
            </div>
            <div
              className={`menu-item ${selectedMenu === "brands" ? "active" : ""}`}
              onClick={() => handleMenuClick("brands")}
            >
              Brands
            </div>
            <div
              className={`menu-item ${selectedMenu === "categories" ? "active" : ""}`}
              onClick={() => handleMenuClick("categories")}
            >
              Categories
            </div>
            <div
              className={`menu-item ${selectedMenu === "countries" ? "active" : ""}`}
              onClick={() => handleMenuClick("countries")}
            >
              Countries
            </div>
            <div
              className={`menu-item ${selectedMenu === "madeOf" ? "active" : ""}`}
              onClick={() => handleMenuClick("madeOf")}
            >
              Made of
            </div>
          </>
        )}

       

        
      </div>
    </div>
  );
}

export default SupplierSidebar;

