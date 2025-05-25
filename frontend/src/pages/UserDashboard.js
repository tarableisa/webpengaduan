// src/pages/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReportForm from './ReportForm';
import {
  FiPlusCircle,
  FiLogOut,
  FiEdit,
  FiMenu,
  FiX,
  FiList,
} from 'react-icons/fi';

const UserDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editId, setEditId] = useState(null);
  // default sidebar tertutup
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserForms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/form', { withCredentials: true });
      setForms(res.data);
    } catch {
      setError('Gagal mengambil data pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserForms();
  }, []);

  const handleLogout = async () => {
    await api.delete('/logout', { withCredentials: true });
    navigate('/login');
  };

  const handleCreate = () => {
    setEditId(null);
    setShowForm(true);
    setShowList(false);
  };

  const handleEdit = id => {
    setEditId(id);
    setShowForm(true);
    setShowList(false);
  };

  const handleShowList = () => {
    setShowForm(false);
    setShowList(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditId(null);
    setShowList(true);
    fetchUserForms();
  };

  return (
    <div className={`flex min-h-screen bg-red-50 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
      {/* toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded shadow"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* sidebar (selalu di-DOM, tapi di-translate keluar layar saat tertutup) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-red-200 p-6
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <h2 className="mt-10 text-2xl font-bold text-red-700 mb-6">User Dashboard</h2>

        <button
          onClick={handleCreate}
          className="flex items-center w-full mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
        >
          <FiPlusCircle className="mr-2" /> Buat Pengaduan
        </button>

        <button
          onClick={handleShowList}
          className="flex items-center w-full mb-4 bg-red-200 hover:bg-red-300 text-red-800 py-2 px-3 rounded"
        >
          <FiList className="mr-2" /> Daftar Pengaduan
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center w-full bg-gray-200 hover:bg-gray-300 text-red-700 py-2 px-3 rounded"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </aside>

      {/* main content */}
      <main className="flex-1 p-8">
        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-red-700 mb-4">
              {editId ? 'Edit Pengaduan' : 'Form Pengaduan Baru'}
            </h1>
            <ReportForm formId={editId} onSuccess={handleFormSuccess} />
          </div>
        ) : showList ? (
          <>
<h1 className="text-2xl font-bold text-red-700 mb-6 text-center">Daftar Pengaduan Anda</h1>            
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : forms.length === 0 ? (
              <p className="text-gray-600">Belum ada pengaduan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-red-100 text-red-700">
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Nama Pelapor</th>
                      <th className="py-3 px-4 text-left">Lokasi</th>
                      <th className="py-3 px-4 text-left">Waktu Kejadian</th>
                      <th className="py-3 px-4 text-left">Deskripsi</th>
                      <th className="py-3 px-4 text-left">Bukti</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map(form => (
                      <tr key={form.id} className="border-t hover:bg-red-50">
                        <td className="py-2 px-4">{form.id}</td>
                        <td className="py-2 px-4">{form.namaPelapor || '-'}</td>
                        <td className="py-2 px-4">{form.lokasi}</td>
                        <td className="py-2 px-4">
                          {new Date(form.waktuKejadian).toLocaleString()}
                        </td>
                        <td className="py-2 px-4">{form.deskripsi}</td>
                        <td className="py-2 px-4">
                          {form.bukti ? (
                            <button
                              onClick={() => window.open(form.bukti, '_blank')}
                              className="text-red-600 hover:underline"
                            >
                              Lihat Bukti
                            </button>

                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-2 px-4 capitalize">{form.status}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleEdit(form.id)}
                            className="flex items-center bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600">Klik tombol menu untuk mulai.</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
