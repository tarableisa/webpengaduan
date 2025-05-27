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
    <div className={`flex min-h-screen bg-red-50 transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
      {/* Toggle Sidebar */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        className="fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded shadow-lg"
      >
        {sidebarOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-red-200 p-6
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <h2 className="mt-10 text-2xl font-bold text-red-700 mb-8">User Dashboard</h2>
        <button onClick={handleCreate}
          className="flex items-center w-full mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition">
          <FiPlusCircle className="mr-2"/> Buat Pengaduan
        </button>
        <button onClick={handleShowList}
          className="flex items-center w-full mb-8 bg-red-200 hover:bg-red-300 text-red-800 py-2 px-3 rounded transition">
          <FiList className="mr-2"/> Daftar Pengaduan
        </button>
        <button onClick={handleLogout}
          className="flex items-center w-full bg-gray-200 hover:bg-gray-300 text-red-700 py-2 px-3 rounded transition">
          <FiLogOut className="mr-2"/> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {showForm ? (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-red-700 mb-6">
              {editId ? 'Edit Pengaduan' : 'Form Pengaduan Baru'}
            </h1>
            <ReportForm formId={editId} onSuccess={handleFormSuccess}/>
          </div>
        ) : showList ? (
          <>
            <h1 className="text-3xl font-extrabold text-red-700 mb-8 text-center">
              Daftar Pengaduan Anda
            </h1>
            {loading ? (
              <p className="text-center text-gray-500">Loading…</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : forms.length === 0 ? (
              <p className="text-center text-gray-600">Belum ada pengaduan.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {forms.map(form => (
                  <div key={form.id}
                       className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">ID: {form.id}</div>
                      {form.namaPelapor && <h2 className="text-xl font-semibold text-red-700 mb-1">{form.namaPelapor}</h2>}
                      <p className="text-gray-600 mb-2"><strong>Lokasi:</strong> {form.lokasi}</p>
                      <p className="text-gray-600 mb-2">
                        <strong>Waktu:</strong>{' '}
                        {new Date(form.waktuKejadian).toLocaleString()}
                      </p>
                      <p className="text-gray-700 mb-3 whitespace-pre-line">{form.deskripsi}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <a href={form.bukti} target="_blank" rel="noreferrer"
                         className="text-red-600 hover:underline text-sm">
                        Lihat Bukti
                      </a>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                          ${form.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          form.status === 'proses'  ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'}`}>
                        {form.status}
                      </span>
                      <button
                        onClick={() => handleEdit(form.id)}
                        className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                        title="Edit"
                      >
                        <FiEdit size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 mt-20">Klik tombol “Daftar Pengaduan” di sidebar untuk mulai.</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
