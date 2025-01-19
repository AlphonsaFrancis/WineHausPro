import React from "react";
import { Navigate } from "react-router-dom";

const DeliveryAgentProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.is_delivery_agent) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default DeliveryAgentProtectedRoute;
