import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/form', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForms(res.data);
      setLoading(false);
    } catch (err) {
  console.error(err); // tambahkan ini
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-3 cursor-pointer font-semibold">Lihat Semua Pengaduan</li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-xl font-bold mb-4">Daftar Pengaduan User</h1>
        {forms.length === 0 && <p>Belum ada pengaduan.</p>}
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nama Pelapor</th>
              <th className="py-2 px-4 border">Lokasi</th>
              <th className="py-2 px-4 border">Waktu Kejadian</th>
              <th className="py-2 px-4 border">Deskripsi</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form.id} className="text-center border-b">
                <td className="py-2 px-4">{form.id}</td>
                <td className="py-2 px-4">{form.namaPelapor || '-'}</td>
                <td className="py-2 px-4">{form.lokasi}</td>
                <td className="py-2 px-4">{new Date(form.waktuKejadian).toLocaleString()}</td>
                <td className="py-2 px-4 max-w-xs truncate">{form.deskripsi}</td>
                <td className="py-2 px-4">
                  <select
                    className="border rounded px-2 py-1"
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
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminDashboard;
