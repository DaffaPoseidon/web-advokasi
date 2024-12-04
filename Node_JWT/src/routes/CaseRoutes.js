const express = require("express");
const { createCase, getAllCases, updateCase, upload, getFile } = require('../controller/CaseController');
const { authenticateToken } = require("../utils/authMiddleware");

const router = express.Router();

// Rute untuk kasus
router.post("/", authenticateToken, upload.single("file"), createCase); // Menambahkan kasus baru
router.get("/", getAllCases); // Mengambil daftar kasus
// router.put("/:id", authenticateToken, upload.single("file"), updateCase);
router.put("/:id", authenticateToken, upload.single("file"), updateCase); // Mengedit kasus
router.get("/:id/file", getFile); // Tidak menggunakan `authenticateToken`

module.exports = router;
