import React from 'react';
import { Navigate } from 'react-router-dom';

const StaffProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default StaffProtectedRoute;

