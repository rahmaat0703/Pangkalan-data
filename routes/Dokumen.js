// logic/dokumen.js
const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get semua dokumen layanan
 */
const getAllDokumen = async () => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id,
                layanan_slug,
                jenis_dokumen,
                nama_file,
                file_path,
                ukuran_file,
                uploaded_at,
                uploaded_by
            FROM dokumen_layanan
            ORDER BY uploaded_at DESC
        `);
        return rows;
    } catch (error) {
        console.error('Error getting dokumen:', error);
        throw error;
    }
};

/**
 * Get dokumen by layanan slug
 */
const getDokumenByLayanan = async (slug) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                id,
                layanan_slug,
                jenis_dokumen,
                nama_file,
                file_path,
                ukuran_file,
                uploaded_at,
                uploaded_by
            FROM dokumen_layanan
            WHERE layanan_slug = ?
            ORDER BY jenis_dokumen, uploaded_at DESC
        `, [slug]);
        return rows;
    } catch (error) {
        console.error('Error getting dokumen by layanan:', error);
        throw error;
    }
};

/**
 * Get dokumen by ID
 */
const getDokumenById = async (id) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM dokumen_layanan WHERE id = ?
        `, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error getting dokumen by id:', error);
        throw error;
    }
};

/**
 * Upload dokumen baru
 */
const uploadDokumen = async (data) => {
    try {
        const { layanan_slug, jenis_dokumen, nama_file, file_path, ukuran_file, uploaded_by } = data;
        
        // Cek apakah sudah ada dokumen dengan jenis yang sama untuk layanan ini
        const [existing] = await db.query(`
            SELECT id, file_path FROM dokumen_layanan 
            WHERE layanan_slug = ? AND jenis_dokumen = ?
        `, [layanan_slug, jenis_dokumen]);
        
        if (existing.length > 0) {
            // Hapus file lama
            const oldFilePath = path.join(__dirname, '..', existing[0].file_path);
            try {
                await fs.unlink(oldFilePath);
            } catch (err) {
                console.error('Error deleting old file:', err);
            }
            
            // Update record
            await db.query(`
                UPDATE dokumen_layanan 
                SET nama_file = ?, 
                    file_path = ?, 
                    ukuran_file = ?, 
                    uploaded_at = NOW(), 
                    uploaded_by = ?
                WHERE id = ?
            `, [nama_file, file_path, ukuran_file, uploaded_by, existing[0].id]);
            
            return { id: existing[0].id, updated: true };
        } else {
            // Insert new record
            const [result] = await db.query(`
                INSERT INTO dokumen_layanan 
                (layanan_slug, jenis_dokumen, nama_file, file_path, ukuran_file, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [layanan_slug, jenis_dokumen, nama_file, file_path, ukuran_file, uploaded_by]);
            
            return { id: result.insertId, updated: false };
        }
    } catch (error) {
        console.error('Error uploading dokumen:', error);
        throw error;
    }
};

/**
 * Delete dokumen
 */
const deleteDokumen = async (id) => {
    try {
        // Get file info
        const dokumen = await getDokumenById(id);
        if (!dokumen) {
            throw new Error('Dokumen tidak ditemukan');
        }
        
        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', dokumen.file_path);
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.error('Error deleting file:', err);
            // Continue deleting from database even if file doesn't exist
        }
        
        // Delete from database
        await db.query('DELETE FROM dokumen_layanan WHERE id = ?', [id]);
        
        return true;
    } catch (error) {
        console.error('Error deleting dokumen:', error);
        throw error;
    }
};

/**
 * Get statistik dokumen
 */
const getStatistik = async () => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_dokumen,
                COUNT(DISTINCT layanan_slug) as layanan_dengan_dokumen,
                SUM(ukuran_file) as total_ukuran
            FROM dokumen_layanan
        `);
        
        const [byLayanan] = await db.query(`
            SELECT 
                layanan_slug,
                COUNT(*) as jumlah_dokumen
            FROM dokumen_layanan
            GROUP BY layanan_slug
        `);
        
        return {
            ...stats[0],
            by_layanan: byLayanan
        };
    } catch (error) {
        console.error('Error getting statistik:', error);
        throw error;
    }
};

/**
 * Format ukuran file
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

module.exports = {
    getAllDokumen,
    getDokumenByLayanan,
    getDokumenById,
    uploadDokumen,
    deleteDokumen,
    getStatistik,
    formatFileSize
};