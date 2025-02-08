const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  noPerkara: { type: String, required: true },
  penggugat: { type: String, required: true },
  objekGugatan: { type: String, required: true },
  mdnSebagai: { type: String, required: true },
  status: { type: String, enum: ['Sedang Berjalan', 'Selesai', 'Semi Aktif'], required: true },
  posisiPerkara: {type: String, enum: ['Banding', 'Kasasi', 'PK Aktif'], required: true},
  penggugah: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referensi ke User
  // file: { type: Buffer, required: true },
  files: [
    {
      fileName: { type: String },
      fileData: { type: Buffer },
    }
  ],
  fileName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', caseSchema);
