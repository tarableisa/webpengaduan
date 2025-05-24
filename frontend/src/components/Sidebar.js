import React from 'react';

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-8">Dashboard</h2>

      {role === 'admin' ? (
        <>
          <a href="/admin/dashboard" className="mb-4 hover:bg-gray-700 p-2 rounded">Semua Pengaduan</a>
          <a href="/admin/manage-users" className="mb-4 hover:bg-gray-700 p-2 rounded">Kelola Pengguna</a>
          <a href="/admin/reports" className="mb-4 hover:bg-gray-700 p-2 rounded">Laporan</a>
        </>
      ) : (
        <>
          <a href="/user/dashboard" className="mb-4 hover:bg-gray-700 p-2 rounded">Pengaduan Saya</a>
          <a href="/user/create-report" className="mb-4 hover:bg-gray-700 p-2 rounded">Buat Pengaduan Baru</a>
          <a href="/user/history" className="mb-4 hover:bg-gray-700 p-2 rounded">Riwayat</a>
        </>
      )}

      <button className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded" onClick={() => {
        // logout logic here (optional)
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
