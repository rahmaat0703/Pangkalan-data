const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const uploadDokumen = require('../middleware/uploadDokumen');
const dokumenLogic = require('../logic/dokumen');

const isAdmin = roleMiddleware.isAdmin;
// nama sangat penting di sini 

// Dashboard stats
router.get('/dashboard-stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [totalPegawai] = await db.query('SELECT COUNT(*) as total FROM karyawan');
        const [totalKonsultasi] = await db.query('SELECT COUNT(*) as total FROM pengunjung');
        const [izinMenunggu] = await db.query("SELECT COUNT(*) as total FROM izin WHERE status = 'Menunggu'");
        const [konsultasiMenunggu] = await db.query("SELECT COUNT(*) as total FROM pengunjung WHERE status = 'Menunggu'");

        res.json({
            success: true,
            data: {
                totalPegawai: totalPegawai[0].total,
                totalKonsultasi: totalKonsultasi[0].total,
                izinMenunggu: izinMenunggu[0].total,
                konsultasiMenunggu: konsultasiMenunggu[0].total
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
    }
});

// PEGAWAI CRUD
router.get('/pegawai', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nip, nama, email, jabatan, role, foto, tanggal_bergabung FROM karyawan ORDER BY nama');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pegawai' });
    }
});

router.post('/pegawai', isAuthenticated, isAdmin, upload.single('foto'), async (req, res) => {
    try {
        const { nip, nama, email, password, jabatan, role, tanggal_bergabung } = req.body;
        const foto = req.file ? `/img/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO karyawan (nip, nama, email, password, jabatan, role, foto, tanggal_bergabung) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nip, nama, email, password, jabatan, role, foto, tanggal_bergabung]
        );

        res.json({ success: true, message: 'Pegawai berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan pegawai' });
    }
});

router.put('/pegawai/:id', isAuthenticated, isAdmin, upload.single('foto'), async (req, res) => {
    try {
        const { nip, nama, email, password, jabatan, role } = req.body;
        const foto = req.file ? `/img/${req.file.filename}` : null;

        let query = 'UPDATE karyawan SET nip = ?, nama = ?, email = ?, jabatan = ?, role = ?';
        let params = [nip, nama, email, jabatan, role];

        if (password) {
            query += ', password = ?';
            params.push(password);
        }

        if (foto) {
            query += ', foto = ?';
            params.push(foto);
        }

        query += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(query, params);
        res.json({ success: true, message: 'Data pegawai berhasil diupdate' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal update data pegawai' });
    }
});

router.delete('/pegawai/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM karyawan WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Pegawai berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus pegawai' });
    }
});

// IZIN - Verifikasi
router.get('/izin', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT i.*, k.nama as nama_pegawai, k.nip, k.jabatan 
            FROM izin i
            JOIN karyawan k ON i.karyawan_id = k.id
            ORDER BY i.tanggal DESC, i.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data izin' });
    }
});

router.put('/izin/:id/verifikasi', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status, catatan_admin } = req.body;

        await db.query(
            'UPDATE izin SET status = ?, catatan_admin = ? WHERE id = ?',
            [status, catatan_admin, req.params.id]
        );

        res.json({ success: true, message: 'Izin berhasil diverifikasi' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal memverifikasi izin' });
    }
});

// PELANGGARAN
router.get('/pelanggaran', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.nama as nama_pegawai, k.nip, k.jabatan 
            FROM pelanggaran p
            JOIN karyawan k ON p.karyawan_id = k.id
            ORDER BY p.tanggal DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pelanggaran' });
    }
});

router.post('/pelanggaran', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { karyawan_id, jenis_pelanggaran, tanggal, deskripsi, sanksi } = req.body;

        const [result] = await db.query(
            'INSERT INTO pelanggaran (karyawan_id, jenis_pelanggaran, tanggal, deskripsi, sanksi) VALUES (?, ?, ?, ?, ?)',
            [karyawan_id, jenis_pelanggaran, tanggal, deskripsi, sanksi]
        );

        res.json({ success: true, message: 'Pelanggaran berhasil dicatat', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mencatat pelanggaran' });
    }
});

router.delete('/pelanggaran/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM pelanggaran WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Data pelanggaran berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data pelanggaran' });
    }
});

// KONSULTASI - Kelola
router.get('/konsultasi', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pengunjung ORDER BY tanggal_dibuat DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data konsultasi' });
    }
});

router.put('/konsultasi/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        await db.query(
            'UPDATE pengunjung SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ success: true, message: 'Status konsultasi berhasil diupdate' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal update status konsultasi' });
    }
});

router.delete('/konsultasi/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM pengunjung WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Data konsultasi berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data konsultasi' });
    }
});

// ============================================
// DOKUMEN LAYANAN ROUTES
// ============================================

// Get all dokumen
router.get('/dokumen', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const dokumen = await dokumenLogic.getAllDokumen();
        res.json({ success: true, data: dokumen });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data dokumen' });
    }
});

// Get dokumen by ID
router.get('/dokumen/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const dokumen = await dokumenLogic.getDokumenById(req.params.id);
        if (!dokumen) {
            return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan' });
        }
        res.json({ success: true, data: dokumen });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data dokumen' });
    }
});

// Upload dokumen baru
router.post('/dokumen', isAuthenticated, isAdmin, uploadDokumen.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
        }

        const { judul, kategori_layanan, deskripsi } = req.body;
        
        const dokumenData = {
            judul,
            kategori_layanan,
            deskripsi: deskripsi || null,
            nama_file: req.file.originalname,
            file_path: `/uploads/dokumen/${req.file.filename}`,
            ukuran_file: req.file.size,
            tipe_file: req.file.mimetype,
            diupload_oleh: req.session.user.id
        };

        const id = await dokumenLogic.createDokumen(dokumenData);
        
        res.json({ 
            success: true, 
            message: 'Dokumen berhasil diupload',
            id: id,
            data: dokumenData
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupload dokumen' });
    }
});

// Update dokumen
router.put('/dokumen/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { judul, kategori_layanan, deskripsi, status } = req.body;
        
        await dokumenLogic.updateDokumen(req.params.id, {
            judul,
            kategori_layanan,
            deskripsi,
            status
        });
        
        res.json({ success: true, message: 'Dokumen berhasil diupdate' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupdate dokumen' });
    }
});

// Delete dokumen
router.delete('/dokumen/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await dokumenLogic.deleteDokumen(req.params.id);
        res.json({ success: true, message: 'Dokumen berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus dokumen' });
    }
});

// Get statistik dokumen
router.get('/dokumen-stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const stats = await dokumenLogic.getDokumenStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik dokumen' });
    }
});

module.exports = router;