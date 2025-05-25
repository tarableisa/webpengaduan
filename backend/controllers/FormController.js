import Form from "../models/FormModel.js";
import fs from "fs";
import path from "path";
import bucket from "../config/gcs.js";

// Buat form laporan
export const createForm = async (req, res) => {
  const { namaPelapor, lokasi, waktuKejadian, deskripsi } = req.body;
  let buktiUrl = null;

  try {
    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const gcsFileName = `${Date.now()}-${originalname}`;
      const file = bucket.file(gcsFileName);

      const stream = file.createWriteStream({
        resumable: false,
        contentType: mimetype,
      });

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
        stream.end(buffer);
      });

      // Buat URL akses publik (jika bucket kamu publik)
      buktiUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
    }

    const form = await Form.create({
      namaPelapor,
      lokasi,
      waktuKejadian,
      deskripsi,
      bukti: buktiUrl,
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

  try {
    const form = await Form.findByPk(id);
    if (!form) return res.status(404).json({ message: "Form tidak ditemukan" });

    let buktiUrl = form.bukti;

    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const gcsFileName = `${Date.now()}-${originalname}`;
      const file = bucket.file(gcsFileName);

      const stream = file.createWriteStream({
        resumable: false,
        contentType: mimetype,
      });

      await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", resolve);
        stream.end(buffer);
      });

      buktiUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
    }

    form.namaPelapor = namaPelapor;
    form.lokasi = lokasi;
    form.waktuKejadian = waktuKejadian;
    form.deskripsi = deskripsi;
    form.bukti = buktiUrl;

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

    if (form.bukti) {
      const fileName = form.bukti.split("/").pop(); // ambil nama file dari URL
      const file = bucket.file(fileName);
      await file.delete().catch(() => {
        console.warn("Gagal hapus file dari GCS (mungkin sudah tidak ada)");
      });
    }

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
