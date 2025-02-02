import React from "react";
import { Navigate } from "react-router-dom";

const StockManagerProtected = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.is_supplier) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default StockManagerProtected;
