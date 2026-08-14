const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads/dokumen ada
const uploadDir = path.join(__dirname, '../public/uploads/dokumen');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Format: dokumen_timestamp_originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, 'dokumen_' + uniqueSuffix + '_' + sanitizedName + ext);
    }
});

// Filter file - hanya terima PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const allowedExts = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file PDF, DOC, dan DOCX yang diperbolehkan!'), false);
    }
};

// Konfigurasi multer
const uploadDokumen = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Maksimal 10MB
    }
});

module.exports = uploadDokumen;