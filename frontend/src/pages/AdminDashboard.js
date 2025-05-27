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
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-red-700 text-white flex flex-col justify-between py-6 px-4 shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-10">Admin Dashboard</h2>
          <nav>
            <ul>
              <li className="mb-4 font-medium text-lg hover:text-red-200 transition cursor-pointer">
                📋 Lihat Semua Pengaduan
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-white text-red-700 py-2 rounded-xl font-semibold hover:bg-red-100 transition shadow"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-red-700 mb-8 border-b pb-2">Daftar Pengaduan User</h1>

        {forms.length === 0 ? (
          <p className="text-gray-600 text-lg">Belum ada pengaduan.</p>
        ) : (
<div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        {['ID','Nama Pelapor','Lokasi','Waktu Kejadian','Deskripsi','Bukti','Status','Aksi'].map((h) => (
          <th
            key={h}
            className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-xs"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 text-gray-700">
      {forms.map((form) => (
        <tr key={form.id} className="hover:bg-gray-50 transition-all duration-200">
          <td className="px-6 py-4">{form.id}</td>
          <td className="px-6 py-4 font-semibold text-gray-800">{form.namaPelapor || '-'}</td>
          <td className="px-6 py-4">{form.lokasi}</td>
          <td className="px-6 py-4">{new Date(form.waktuKejadian).toLocaleString()}</td>
          <td className="px-6 py-4 max-w-xs truncate" title={form.deskripsi}>{form.deskripsi}</td>
          <td className="px-6 py-4">
            {form.bukti ? (
              <button
                onClick={() => window.open(form.bukti, '_blank')}
                className="text-blue-600 hover:underline font-medium"
              >
                📎 Lihat Bukti
              </button>
            ) : (
              <span className="text-gray-400">Tidak Ada</span>
            )}
          </td>
          <td className="px-6 py-4">
            <select
              className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm border focus:outline-none ${
                form.status === 'selesai'
                  ? 'bg-green-100 text-green-800'
                  : form.status === 'proses'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
              value={form.status}
              onChange={(e) => updateStatus(form.id, e.target.value)}
            >
              <option value="pending">⏳ Pending</option>
              <option value="proses">🔄 Proses</option>
              <option value="selesai">✅ Selesai</option>
            </select>
          </td>
          <td className="px-6 py-4">
            <button
              onClick={() => deleteForm(form.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold shadow-sm"
            >
              🗑 Hapus
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
