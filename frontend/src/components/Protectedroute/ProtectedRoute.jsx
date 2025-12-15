import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = () => {
  // Check karo ki token localStorage mein hai ya nahi
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;