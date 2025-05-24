import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ReportForm from "./pages/ReportForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Proteksi untuk Admin */}
        <Route element={<ProtectedRoute roleAccess="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Proteksi untuk User */}
        <Route element={<ProtectedRoute roleAccess="user" />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/report" element={<ReportForm />} />
        </Route>

        {/* Halaman Unauthorized */}
        <Route path="/unauthorized" element={<div>Akses Ditolak</div>} />

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
