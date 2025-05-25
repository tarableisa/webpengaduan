import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/form', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForms(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data pengaduan.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/form/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchForms();
    } catch {
      alert('Gagal update status');
    }
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengaduan ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/form/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchForms();
    } catch {
      alert('Gagal menghapus pengaduan');
    }
  };

  const handleLogout = async () => {
    try {
      await api.delete('/admin/logout', { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/admin/login');
    } catch (error) {
      console.error('Gagal logout:', error);
      alert('Gagal logout');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-red-700 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
          <nav>
            <ul>
              <li className="mb-3 cursor-pointer font-semibold hover:text-red-200">
                📋 Lihat Semua Pengaduan
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white text-red-700 py-2 rounded font-semibold hover:bg-red-100 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-6">
          Daftar Pengaduan User
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
                    <td className="py-2 px-4">{new Date(form.waktuKejadian).toLocaleString()}</td>
                    <td className="py-2 px-4">{form.deskripsi}</td>
                    <td className="py-2 px-4">
                      {form.bukti ? (
                        <a
                          href={`http://localhost:3000/uploads/${form.bukti}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Lihat Bukti
                        </a>
                      ) : '-'}
                    </td>
                    <td className="py-2 px-4">
                      <select
                        className="border border-red-300 rounded px-2 py-1 text-red-700"
                        value={form.status}
                        onChange={(e) => updateStatus(form.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => deleteForm(form.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
