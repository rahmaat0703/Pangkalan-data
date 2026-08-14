const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get semua dokumen
const getAllDokumen = async () => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, k.nama as uploader_nama 
            FROM dokumen_layanan d
            LEFT JOIN karyawan k ON d.diupload_oleh = k.id
            ORDER BY d.tanggal_upload DESC
        `);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Get dokumen by ID
const getDokumenById = async (id) => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, k.nama as uploader_nama 
            FROM dokumen_layanan d
            LEFT JOIN karyawan k ON d.diupload_oleh = k.id
            WHERE d.id = ?
        `, [id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

// Get dokumen by kategori
const getDokumenByKategori = async (kategori) => {
    try {
        console.log('Querying database for kategori:', kategori);
        const [rows] = await db.query(`
            SELECT d.*, k.nama as uploader_nama 
            FROM dokumen_layanan d
            LEFT JOIN karyawan k ON d.diupload_oleh = k.id
            WHERE d.kategori_layanan = ? AND d.status = 'aktif'
            ORDER BY d.tanggal_upload DESC
        `, [kategori]);
        console.log('Query result:', rows.length, 'rows found');
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Create dokumen
const createDokumen = async (data) => {
    try {
        const { judul, kategori_layanan, deskripsi, nama_file, file_path, ukuran_file, tipe_file, diupload_oleh } = data;
        
        const [result] = await db.query(`
            INSERT INTO dokumen_layanan 
            (judul, kategori_layanan, deskripsi, nama_file, file_path, ukuran_file, tipe_file, diupload_oleh)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [judul, kategori_layanan, deskripsi, nama_file, file_path, ukuran_file, tipe_file, diupload_oleh]);
        
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Update dokumen
const updateDokumen = async (id, data) => {
    try {
        const { judul, kategori_layanan, deskripsi, status } = data;
        
        await db.query(`
            UPDATE dokumen_layanan 
            SET judul = ?, kategori_layanan = ?, deskripsi = ?, status = ?
            WHERE id = ?
        `, [judul, kategori_layanan, deskripsi, status, id]);
        
        return true;
    } catch (error) {
        throw error;
    }
};

// Delete dokumen
const deleteDokumen = async (id) => {
    try {
        // Get file path dulu
        const dokumen = await getDokumenById(id);
        
        if (dokumen) {
            // Hapus file fisik
            const filePath = path.join(__dirname, '../public', dokumen.file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            // Hapus dari database
            await db.query('DELETE FROM dokumen_layanan WHERE id = ?', [id]);
        }
        
        return true;
    } catch (error) {
        throw error;
    }
};

// Increment download count
const incrementDownload = async (id) => {
    try {
        await db.query('UPDATE dokumen_layanan SET jumlah_download = jumlah_download + 1 WHERE id = ?', [id]);
        return true;
    } catch (error) {
        throw error;
    }
};

// Get statistik dokumen
const getDokumenStats = async () => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as total FROM dokumen_layanan WHERE status = "aktif"');
        const [byKategori] = await db.query(`
            SELECT kategori_layanan, COUNT(*) as jumlah 
            FROM dokumen_layanan 
            WHERE status = 'aktif'
            GROUP BY kategori_layanan
        `);
        const [totalDownload] = await db.query('SELECT SUM(jumlah_download) as total FROM dokumen_layanan');
        
        return {
            totalDokumen: total[0].total,
            byKategori: byKategori,
            totalDownload: totalDownload[0].total || 0
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllDokumen,
    getDokumenById,
    getDokumenByKategori,
    createDokumen,
    updateDokumen,
    deleteDokumen,
    incrementDownload,
    getDokumenStats
};