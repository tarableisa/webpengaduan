import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UserDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [editLokasi, setEditLokasi] = useState('');
  const [editWaktu, setEditWaktu] = useState('');

  const fetchUserForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/user/form', {
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
    fetchUserForms();
  }, []);

  const startEdit = (form) => {
    setEditId(form.id);
    setEditDeskripsi(form.deskripsi);
    setEditLokasi(form.lokasi);
    setEditWaktu(form.waktuKejadian.slice(0,16)); // ambil format yyyy-MM-ddTHH:mm
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDeskripsi('');
    setEditLokasi('');
    setEditWaktu('');
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('deskripsi', editDeskripsi);
      formData.append('lokasi', editLokasi);
      formData.append('waktuKejadian', editWaktu);

      await api.put(`/form/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      cancelEdit();
      fetchUserForms();
    } catch {
      alert('Gagal update pengaduan');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-3 font-semibold cursor-default">Pengaduan Saya</li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-xl font-bold mb-4">Daftar Pengaduan Anda</h1>
        {forms.length === 0 && <p>Belum ada pengaduan.</p>}
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">ID</th>
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
                <td className="py-2 px-4">
                  {editId === form.id ? (
                    <input
                      type="text"
                      value={editLokasi}
                      onChange={(e) => setEditLokasi(e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    form.lokasi
                  )}
                </td>
                <td className="py-2 px-4">
                  {editId === form.id ? (
                    <input
                      type="datetime-local"
                      value={editWaktu}
                      onChange={(e) => setEditWaktu(e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    new Date(form.waktuKejadian).toLocaleString()
                  )}
                </td>
                <td className="py-2 px-4 max-w-xs">
                  {editId === form.id ? (
                    <textarea
                      value={editDeskripsi}
                      onChange={(e) => setEditDeskripsi(e.target.value)}
                      className="w-full p-1 border rounded"
                      rows={3}
                    />
                  ) : (
                    form.deskripsi
                  )}
                </td>
                <td className="py-2 px-4">{form.status}</td>
                <td className="py-2 px-4">
                  {editId === form.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(form.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(form)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default UserDashboard;
