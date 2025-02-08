const express = require("express");
const { 
  createCase, 
  getAllCases, 
  updateCase, 
  upload, 
  getFile, 
  deleteCase // Tambahkan fungsi deleteCase dari controller
} = require('../controller/CaseController');

const { authenticateToken } = require("../utils/authMiddleware");

const router = express.Router();

// Rute untuk kasus
router.post("/", authenticateToken, upload.array("files", 100), createCase); // Menambahkan kasus baru hingga 10 file
// router.post("/", authenticateToken, upload.single("file"), createCase); // Menambahkan kasus baru
router.get("/", getAllCases); // Mengambil daftar kasus
router.put("/:id", authenticateToken, upload.array("files", 100), updateCase);
// router.put("/:id", authenticateToken, upload.single("file"), updateCase); // Mengedit kasus
router.get("/:id/file", getFile); // Tidak menggunakan `authenticateToken`
router.delete("/:id", authenticateToken, deleteCase); // Menambahkan route untuk menghapus kasus

module.exports = router;
