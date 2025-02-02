import React, { useEffect, useState } from "react";
import "./admindashboard.css";
import AdminNavbar from "../../components/AdminNavbar";
import ProductDashboard from "../../pages/dashboard/admin/ProductDashboard";
import Brands from "../../pages/dashboard/admin/Brands";
import config from "../../config/config";

import axios from "axios";
import CategoryDashboard from "./admin/CategoryDashboard";
import CountryDashboard from "./admin/CountryDashboard";
import MadeofDashboard from "./admin/MadeofDashboard";
import Welcome from "./admin/Welcome";
import { useLocation, useNavigate } from "react-router-dom";
import SupplierSidebar from "../../components/SupplierSidebar";

function SupplierDashboard() {
  const location = useLocation();
  const path = location.pathname.split("/");
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState("welcome");

  useEffect(() => {
    
    if (path[path.length - 1] === "products") {
      setSelectedMenu("allProducts");
    }
    if (path[path.length - 1] === "brands") {
      setSelectedMenu("brands");
    }if (path[path.length - 1] === "categories") {
      setSelectedMenu("categories");
    }if (path[path.length - 1] === "countries") {
      setSelectedMenu("countries");
    }if (path[path.length - 1] === "madeOf") {
      setSelectedMenu("madeOf");
    }
  }, [location, path]);

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}api/v1/products/category-list/`)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("categories", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}api/v1/products/brand-list/`)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("brands", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}api/v1/products/country-list/`)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("countries", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}api/v1/products/madeof-list/`)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("madeOf", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const handleSelectedMenu = (menu)=>{
    setSelectedMenu(menu)
    if(menu === "allProducts") navigate("/stocks/products");
    if (menu === "brands") navigate("/stocks/brands");
    if (menu === "categories") navigate("/stocks/categories");
    if (menu === "countries") navigate("/stocks/countries");
    if (menu === "madeOf") navigate("/stocks/madeOf");
  }

  return (
    <div className="dashboard-main-container">
      <div className="sidebar-main-container">
        <SupplierSidebar setSelectedMenu={handleSelectedMenu} />
      </div>
      <div className="content-container">
        <AdminNavbar />
        <div className="content">
          {selectedMenu === "welcome" ? (
            <Welcome />
          ) : selectedMenu === "allProducts" ? (
            <ProductDashboard />
          ) : selectedMenu === "brands" ? (
            <Brands />
          ) : selectedMenu === "categories" ? (
            <CategoryDashboard />
          ) : selectedMenu === "countries" ? (
            <CountryDashboard />
          ) : selectedMenu === "madeOf" ? (
            <MadeofDashboard />
          ) : (
            "No Data Found"
          )}
        </div>
      </div>
    </div>
  );
}

export default SupplierDashboard;
