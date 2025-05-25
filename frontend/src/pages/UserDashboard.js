import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReportForm from './ReportForm';
import { FiPlusCircle, FiLogOut, FiEdit } from 'react-icons/fi';

const UserDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const fetchUserForms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/form', { withCredentials: true });
      setForms(res.data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserForms();
  }, []);

  const handleLogout = async () => {
    try {
      await api.delete('/logout', { withCredentials: true });
      navigate('/login');
    } catch {
      alert('Gagal logout');
    }
  };

  const handleCreate = () => {
    setEditId(null);
    setShowForm(true);
    setShowList(false);
  };

  const handleEdit = (id) => {
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-red-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-red-200 p-6 relative">
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          {/* Logo placeholder */}
        </div>

        <h2 className="mt-20 text-2xl font-bold text-red-700 mb-8">
          User Dashboard
        </h2>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center w-full mb-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
        >
          <FiPlusCircle className="mr-2" /> Buat Pengaduan
        </button>

        <button
          onClick={handleShowList}
          className="flex items-center justify-center w-full mb-4 bg-red-200 hover:bg-red-300 text-red-800 py-2 rounded transition"
        >
          📋 Daftar Pengaduan
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 text-red-700 py-2 rounded transition"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </aside>

      {/* Main Content */}
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
            <h1 className="text-2xl font-bold text-red-700 mb-6">
              Daftar Pengaduan Anda
            </h1>

            {forms.length === 0 ? (
              <p className="text-gray-600">Belum ada pengaduan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-red-100 text-red-700">
                      {['ID','Nama Pelapor','Lokasi','Waktu Kejadian','Deskripsi','Bukti','Status','Aksi']
                        .map((h) => (
                          <th key={h} className="py-3 px-4 text-left font-medium">{h}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((form) => (
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
                            <a
                              href={`http://localhost:3000/uploads/${form.bukti}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-600 hover:underline"
                            >
                              Lihat Bukti
                            </a>
                          ) : '-'}
                        </td>
                        <td className="py-2 px-4 capitalize">{form.status}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleEdit(form.id)}
                            className="flex items-center bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition"
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
        ) : null}
      </main>
    </div>
  );
};

export default UserDashboard;