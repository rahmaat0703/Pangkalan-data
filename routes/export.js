const express = require('express');
const router = express.Router();
const db = require('../config/db');
const XLSX = require('xlsx');
const isAuthenticated = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const isAdmin = roleMiddleware.isAdmin;

// Export data pegawai
router.get('/pegawai', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT nip, nama, email, jabatan, role, tanggal_bergabung FROM karyawan');

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pegawai');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=data-pegawai.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal export data pegawai' });
    }
});

// Export data izin
router.get('/izin', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                k.nip, k.nama, i.tanggal, i.jam_keluar, i.jam_kembali, 
                i.keterangan, i.status, i.catatan_admin
            FROM izin i
            JOIN karyawan k ON i.karyawan_id = k.id
            ORDER BY i.tanggal DESC
        `);

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Izin');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=data-izin.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal export data izin' });
    }
});

// Export data konsultasi
router.get('/konsultasi', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                nama, email, nomor, kategori_instansi, nama_instansi, 
                keperluan, status, tanggal_dibuat
            FROM pengunjung
            ORDER BY tanggal_dibuat DESC
        `);

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Konsultasi');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=data-konsultasi.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal export data konsultasi' });
    }
});

// Export data pelanggaran
router.get('/pelanggaran', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                k.nip, k.nama, p.jenis_pelanggaran, p.tanggal, 
                p.deskripsi, p.sanksi
            FROM pelanggaran p
            JOIN karyawan k ON p.karyawan_id = k.id
            ORDER BY p.tanggal DESC
        `);

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pelanggaran');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=data-pelanggaran.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Gagal export data pelanggaran' });
    }
});

module.exports = router;