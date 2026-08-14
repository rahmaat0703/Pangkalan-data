const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

const isPegawai = roleMiddleware.isPegawai;

// Get profil pegawai
router.get('/profil', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nip, nama, email, jabatan, foto, tanggal_bergabung FROM karyawan WHERE id = ?',
            [req.session.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data profil' });
    }
});

// Update profil
router.put('/profil', isAuthenticated, isPegawai, (req, res, next) => {
    upload.single('foto')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ 
                success: false, 
                message: 'Error upload foto: ' + err.message 
            });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { nama, email } = req.body;
        const foto = req.file ? `/img/${req.file.filename}` : null;

        let query = 'UPDATE karyawan SET nama = ?, email = ?';
        let params = [nama, email];

        if (foto) {
            query += ', foto = ?';
            params.push(foto);
        }

        query += ' WHERE id = ?';
        params.push(req.session.user.id);

        await db.query(query, params);

        req.session.user.nama = nama;
        req.session.user.email = email;
        if (foto) req.session.user.foto = foto;

        res.json({ success: true, message: 'Profil berhasil diupdate' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal update profil: ' + error.message });
    }
});

// Ganti password
router.post('/ganti-password', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const { passwordLama, passwordBaru } = req.body;

        const [rows] = await db.query(
            'SELECT password FROM karyawan WHERE id = ?',
            [req.session.user.id]
        );

        if (rows[0].password !== passwordLama) {
            return res.status(400).json({ success: false, message: 'Password lama salah' });
        }

        await db.query(
            'UPDATE karyawan SET password = ? WHERE id = ?',
            [passwordBaru, req.session.user.id]
        );

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengganti password' });
    }
});

// IZIN KELUAR-MASUK - Ajukan izin keluar
router.post('/izin', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const { tanggal, jam_keluar, keterangan } = req.body;

        const [result] = await db.query(
            'INSERT INTO izin (karyawan_id, tanggal, jam_keluar, keterangan) VALUES (?, ?, ?, ?)',
            [req.session.user.id, tanggal, jam_keluar, keterangan]
        );

        res.json({ 
            success: true, 
            message: 'Izin keluar berhasil dicatat',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mencatat izin keluar' });
    }
});

// Update jam kembali
router.put('/izin/:id/kembali', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const { jam_kembali } = req.body;

        await db.query(
            'UPDATE izin SET jam_kembali = ? WHERE id = ? AND karyawan_id = ?',
            [jam_kembali, req.params.id, req.session.user.id]
        );

        res.json({ success: true, message: 'Jam kembali berhasil dicatat' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mencatat jam kembali' });
    }
});

// Get daftar izin pegawai
router.get('/izin', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM izin WHERE karyawan_id = ? ORDER BY tanggal DESC, created_at DESC',
            [req.session.user.id]
        );

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data izin' });
    }
});

// Dashboard stats untuk pegawai
router.get('/dashboard-stats', isAuthenticated, isPegawai, async (req, res) => {
    try {
        const [izinBulanIni] = await db.query(
            `SELECT COUNT(*) as total FROM izin 
             WHERE karyawan_id = ? AND MONTH(tanggal) = MONTH(CURRENT_DATE()) 
             AND YEAR(tanggal) = YEAR(CURRENT_DATE())`,
            [req.session.user.id]
        );

        const [izinMenunggu] = await db.query(
            `SELECT COUNT(*) as total FROM izin 
             WHERE karyawan_id = ? AND status = 'Menunggu'`,
            [req.session.user.id]
        );

        const [pelanggaran] = await db.query(
            `SELECT COUNT(*) as total FROM pelanggaran 
             WHERE karyawan_id = ?`,
            [req.session.user.id]
        );

        res.json({
            success: true,
            data: {
                izinBulanIni: izinBulanIni[0].total,
                izinMenunggu: izinMenunggu[0].total,
                pelanggaran: pelanggaran[0].total
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
    }
});

module.exports = router;