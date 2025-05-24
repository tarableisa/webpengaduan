import React, { useState, useEffect } from "react";
import api from "../services/api";

const ReportForm = ({ formId, onSuccess }) => {
  const [formData, setFormData] = useState({
    namaPelapor: "",
    lokasi: "",
    waktuKejadian: "",
    deskripsi: "",
    bukti: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Jika formId ada, ambil data form dari backend untuk edit
  useEffect(() => {
    if (formId) {
      setLoading(true);
      api
        .get("/user/form")
        .then((res) => {
          const form = res.data.find((f) => f.id === formId);
          if (form) {
            setFormData({
              namaPelapor: form.namaPelapor || "",
              lokasi: form.lokasi,
              waktuKejadian: form.waktuKejadian.slice(0, 16), // untuk input datetime-local
              deskripsi: form.deskripsi,
              bukti: null, // file direset, tidak diisi karena file tidak bisa di-set value
            });
          } else {
            setError("Form not found");
          }
        })
        .catch(() => setError("Failed to load form data"))
        .finally(() => setLoading(false));
    }
  }, [formId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bukti") {
      setFormData({ ...formData, bukti: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("namaPelapor", formData.namaPelapor);
      data.append("lokasi", formData.lokasi);
      data.append("waktuKejadian", formData.waktuKejadian);
      data.append("deskripsi", formData.deskripsi);
      if (formData.bukti) {
        data.append("bukti", formData.bukti);
      }

      if (formId) {
        // update form
        await api.put(`/form/${formId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // create new form
        await api.post("/form", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <label className="block mb-2">
        Nama Pelapor (opsional):
        <input
          type="text"
          name="namaPelapor"
          value={formData.namaPelapor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Lokasi Kejadian:
        <input
          type="text"
          name="lokasi"
          required
          value={formData.lokasi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Waktu Kejadian:
        <input
          type="datetime-local"
          name="waktuKejadian"
          required
          value={formData.waktuKejadian}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        Deskripsi:
        <textarea
          name="deskripsi"
          required
          value={formData.deskripsi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        Bukti (foto/video):
        <input
          type="file"
          name="bukti"
          accept="image/*,video/*"
          onChange={handleChange}
          className="w-full"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : formId ? "Update Pengaduan" : "Kirim Pengaduan"}
      </button>
    </form>
  );
};

export default ReportForm;
