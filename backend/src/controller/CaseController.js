const multer = require("multer");
const path = require("path");
const Case = require("../models/Case");

// Konfigurasi multer untuk menyimpan file di memori
const storage = multer.memoryStorage(); // Gunakan penyimpanan memori
const upload = multer({ storage }); // Buat instance multer dengan penyimpanan memori

const createCase = async (req, res) => {
  try {
    const { noPerkara, penggugat, objekGugatan, mdnSebagai, status, posisiPerkara } = req.body;

    const newCase = new Case({
      noPerkara,
      penggugat,
      objekGugatan,
      mdnSebagai,
      status,
      posisiPerkara,
      file: req.file ? req.file.buffer : null, // Simpan file sebagai buffer
      fileName: req.file ? req.file.originalname : null, // Simpan nama file
    });

    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambahkan kasus', error: error.message });
  }
};

const getAllCases = async (req, res) => {
  try {
    const { page = 1, filter = "" } = req.query;
    const query = filter ? { status: filter } : {};

    const cases = await Case.find(query)
      .sort({ createdAt: 1 }) // Urutkan ascending berdasarkan waktu input
      .skip((page - 1) * 10000)
      .limit(10000);

    res.status(200).json({ cases });
  } catch (error) {
    res.status(500).json({ message: "Gagal mendapatkan kasus", error: error.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ updateCase ~ id:", id)

    // console.log("Token:", req.headers.authorization);
    console.log("Data diterima untuk update:", req.body); // Debug body request
    if (req.file) {
      console.log("File diterima untuk update:", req.file.originalname); // Debug file
    }

    // Perbarui dokumen di MongoDB
    const updatedData = {
      ...req.body, // Data dari form
    };

    if (req.file) {
      updatedData.file = req.file.buffer; // Tambahkan file jika ada
      updatedData.fileName = req.file.originalname; // Tambahkan nama file jika ada
    }

    const updatedCase = await Case.findByIdAndUpdate(id, updatedData, {
      new: true, // Kembalikan dokumen yang diperbarui
    });

    if (!updatedCase) {
      return res.status(404).json({ message: "Kasus tidak ditemukan." });
    }

    console.log("Kasus berhasil diperbarui:", updatedCase); // Debug hasil update
    res.status(200).json({ message: "Kasus berhasil diperbarui", case: updatedCase });
  } catch (error) {
    console.error("Gagal memperbarui kasus:", error.message);
    res.status(500).json({ message: "Gagal memperbarui kasus", error: error.message });
  }
};


const getFile = async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = await Case.findById(id);

    if (!caseData || !caseData.file || !caseData.fileName) {
      return res.status(404).json({ message: "File tidak ditemukan." });
    }

    // Kirim file untuk diunduh
    res.setHeader("Content-Disposition", `attachment; filename="${caseData.fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(caseData.file);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil file", error: error.message });
  }
};

module.exports = {
  createCase,
  getAllCases,
  updateCase,
  getFile, // Tambahkan fungsi getFile
  upload,
};
