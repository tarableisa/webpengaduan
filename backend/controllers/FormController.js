import Form from "../models/FormModel.js";
import fs from "fs";
import path from "path";

// Buat form laporan
export const createForm = async (req, res) => {
  const { namaPelapor, lokasi, waktuKejadian, deskripsi } = req.body;
  const bukti = req.file ? req.file.filename : null;

  try {
    const form = await Form.create({
      namaPelapor,
      lokasi,
      waktuKejadian,
      deskripsi,
      bukti,
      userId: req.userId,
    });

    res.status(201).json({ message: "Form laporan berhasil dibuat", data: form });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Ambil semua form laporan
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data form", error: error.message });
  }
};

// Update status form laporan berdasarkan ID
export const updateFormStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const form = await Form.findByPk(id);
    if (!form) return res.status(404).json({ message: "Form tidak ditemukan" });

    form.status = status; // pastikan field status ada di model
    await form.save();

    res.status(200).json({ message: "Status form berhasil diupdate", data: form });
  } catch (error) {
    res.status(500).json({ message: "Gagal update status form", error: error.message });
  }
};

// Update seluruh isi form, kecuali status
export const updateForm = async (req, res) => {
  const { id } = req.params;
  const { namaPelapor, lokasi, waktuKejadian, deskripsi } = req.body;
  const bukti = req.file ? req.file.filename : null;

  try {
    const form = await Form.findByPk(id);
    if (!form) return res.status(404).json({ message: "Form tidak ditemukan" });

    form.namaPelapor = namaPelapor;
    form.lokasi = lokasi;
    form.waktuKejadian = waktuKejadian;
    form.deskripsi = deskripsi;

    if (bukti) form.bukti = bukti;

    await form.save();
    res.status(200).json({ message: "Form berhasil diupdate", data: form });
  } catch (error) {
    res.status(500).json({ message: "Gagal update form", error: error.message });
  }
};

// Hapus form
// Hapus form berdasarkan ID, termasuk file gambar
export const deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findByPk(id);
    if (!form) return res.status(404).json({ message: "Form tidak ditemukan" });

    // Hapus file bukti jika ada
    if (form.bukti) {
      const filePath = path.join("uploads", form.bukti);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Gagal menghapus file:", err.message);
      });
    }

    // Hapus form dari database
    await form.destroy();

    res.status(200).json({ message: "Form berhasil dihapus beserta file bukti" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus form", error: error.message });
  }
};

// Menampilkan Form sesuai userId
export const getFormsByUser = async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { userId: req.userId },
    });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data form", error: error.message });
  }
};
