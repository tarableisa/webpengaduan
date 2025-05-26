import React, { useState, useEffect } from "react";
import api from "../services/api";

const ReportForm = ({ formId, onSuccess }) => {
  const [formData, setFormData] = useState({
    namaPelapor: "",
    lokasi: "",
    waktuKejadian: "",
    deskripsi: "",
    bukti: null,
    existingBukti: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill saat edit
  useEffect(() => {
    if (!formId) return;
    setLoading(true);
    api.get("/user/form", { withCredentials: true })
      .then(res => {
        const f = res.data.find(x => x.id === formId);
        if (f) {
          setFormData({
            namaPelapor: f.namaPelapor || "",
            lokasi: f.lokasi,
            waktuKejadian: f.waktuKejadian.slice(0,16),
            deskripsi: f.deskripsi,
            bukti: null,
            existingBukti: f.bukti || ""
          });
        }
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "bukti") {
      setFormData(fd => ({ ...fd, bukti: files[0] }));
    } else {
      setFormData(fd => ({ ...fd, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData();
    data.append("namaPelapor", formData.namaPelapor);
    data.append("lokasi", formData.lokasi);
    data.append("waktuKejadian", formData.waktuKejadian);
    data.append("deskripsi", formData.deskripsi);
    if (formData.bukti) data.append("bukti", formData.bukti);

    try {
      if (formId) {
        // Gunakan PUT sesuai router
        await api.put(`/form/${formId}`, data, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" }
});

      } else {
        await api.post("/form", data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded bg-white">
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <label className="block mb-2">
        Nama Pelapor:
        <input type="text" name="namaPelapor" value={formData.namaPelapor} onChange={handleChange}
          className="w-full p-2 border rounded" />
      </label>

      <label className="block mb-2">
        Lokasi:
        <input type="text" name="lokasi" required value={formData.lokasi} onChange={handleChange}
          className="w-full p-2 border rounded" />
      </label>

      <label className="block mb-2">
        Waktu Kejadian:
        <input type="datetime-local" name="waktuKejadian" required value={formData.waktuKejadian}
          onChange={handleChange} className="w-full p-2 border rounded" />
      </label>

      <label className="block mb-2">
        Deskripsi:
        <textarea name="deskripsi" required value={formData.deskripsi} onChange={handleChange}
          className="w-full p-2 border rounded" />
      </label>

      <label className="block mb-4">
        Bukti:
        <input type="file" name="bukti" accept="image/*,video/*" onChange={handleChange}
          className="w-full" />
      </label>

{formData.existingBukti && (
  <p className="mb-4">
    Bukti lama:{" "}
    <a
      href={formData.existingBukti}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline"
    >
      Lihat Bukti Lama
    </a>
  </p>
)}

      <button type="submit" disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? (formId ? "Updating..." : "Submitting...") : (formId ? "Update Pengaduan" : "Kirim Pengaduan")}
      </button>
    </form>
  );
};

export default ReportForm;
