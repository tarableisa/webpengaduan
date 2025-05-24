import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Ambil token dan role dari localStorage
const getToken = () => localStorage.getItem("token");
const getUserRole = () => localStorage.getItem("role");

const ProtectedRoute = ({ roleAccess }) => {
  const token = getToken();
  const userRole = getUserRole();

  // Jika belum login (tidak ada token)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika login tapi role tidak sesuai
  if (roleAccess && roleAccess !== userRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika semua valid, render isi route-nya
  return <Outlet />;
};

export default ProtectedRoute;
