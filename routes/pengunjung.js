const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getAlamatLengkap, footerData } = require('../logic/footer');
const { processStatistikKeperluan, getChartColors } = require('../logic/konsultasi');
const uploadDokumen = require('../middleware/uploadDokumen');

// Get footer data
router.get('/footer', (req, res) => {
    res.json({
        success: true,
        data: {
            ...footerData,
            alamatLengkap: getAlamatLengkap()
        }
    });
});

// Get statistik konsultasi untuk grafik
router.get('/statistik-konsultasi', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT keperluan FROM pengunjung');
        const statistik = processStatistikKeperluan(rows);
        
        const labels = Object.keys(statistik);
        const data = Object.values(statistik);
        const colors = getChartColors();

        res.json({
            success: true,
            data: {
                labels,
                values: data,
                colors
            }
        });
    } catch (error) {
        console.error('Error getting statistik:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengambil statistik' 
        });
    }
});

// Submit konsultasi
router.post('/konsultasi', uploadDokumen.single('file_pendukung'), async (req, res) => {
    try {
        const { nama, email, nomor, kategori_instansi, nama_instansi, keperluan, keterangan } = req.body;

        if (!nama || !email || !nomor || !kategori_instansi || !nama_instansi || !keperluan) {
            return res.status(400).json({ 
                success: false, 
                message: 'Semua field wajib harus diisi' 
            });
        }

        const file_pendukung = req.file ? `/dokumen/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO pengunjung (nama, email, nomor, kategori_instansi, nama_instansi, keperluan, keterangan, file_pendukung) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nama, email, nomor, kategori_instansi, nama_instansi, keperluan, keterangan, file_pendukung]
        );

        res.json({ 
            success: true, 
            message: 'Permohonan konsultasi berhasil diajukan',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error submitting konsultasi:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengajukan konsultasi: ' + error.message 
        });
    }
});

// Get all konsultasi (public)
router.get('/konsultasi', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nama, kategori_instansi, nama_instansi, keperluan, status, tanggal_dibuat FROM pengunjung ORDER BY tanggal_dibuat DESC'
        );

        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        console.error('Error getting konsultasi:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengambil data konsultasi' 
        });
    }
});

// Get konsultasi by ID
router.get('/konsultasi/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM pengunjung WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data tidak ditemukan' 
            });
        }

        res.json({ 
            success: true, 
            data: rows[0] 
        });
    } catch (error) {
        console.error('Error getting konsultasi detail:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengambil detail konsultasi' 
        });
    }
});

module.exports = router;