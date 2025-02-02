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
import AllUsersDashboard from "./admin/AllUsers";
import AllStaffsDashboard from "./admin/AllStaffs";
import Welcome from "./admin/Welcome";
import AllOrdersDashboard from "./admin/AllOrders";
import StaffSidebar from "../../components/StaffSidebar";
import { useLocation, useNavigate } from "react-router-dom";

function StaffDashboard() {
  const location = useLocation();
  const path = location.pathname.split("/");
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState("welcome");

  useEffect(() => {
    if (path[path.length - 1] === "orders") {
      setSelectedMenu("allOrders");
    }
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
    }if (path[path.length - 1] === "allOrders") {
      setSelectedMenu("orders");
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
    if(menu === "allProducts") navigate("/staff/products");
    if (menu === "brands") navigate("/staff/brands");
    if (menu === "categories") navigate("/staff/categories");
    if (menu === "countries") navigate("/staff/countries");
    if (menu === "madeOf") navigate("/staff/madeOf");
    if (menu === "allOrders") navigate("/staff/orders");

  }


  return (
    <div className="dashboard-main-container">
      <div className="sidebar-main-container">
        <StaffSidebar setSelectedMenu={handleSelectedMenu} />
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
          ) : selectedMenu === "allOrders" ? (
            <AllOrdersDashboard />
          ) : selectedMenu === "newOrders" ? (
            "New Orders"
          ) : selectedMenu === "allStaffs" ? (
            <AllStaffsDashboard />
          ) : selectedMenu === "deactivatedStaffs" ? (
            "Deactivated Staffs"
          ) : selectedMenu === "allUsers" ? (
            <AllUsersDashboard />
          ) : selectedMenu === "deactivatedUsers" ? (
            "Deactivated Users"
          ) : (
            "No Data Found"
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
