const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login
router.post('/login', async (req, res) => {
    try {
        const { nip, password } = req.body;

        if (!nip || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'NIP dan password harus diisi' 
            });
        }

        const [rows] = await db.query(
            'SELECT * FROM karyawan WHERE nip = ? AND password = ?',
            [nip, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'NIP atau password salah' 
            });
        }

        const user = rows[0];
        req.session.user = {
            id: user.id,
            nip: user.nip,
            nama: user.nama,
            email: user.email,
            jabatan: user.jabatan,
            role: user.role,
            foto: user.foto
        };

        res.json({ 
            success: true, 
            message: 'Login berhasil',
            user: req.session.user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan server' 
        });
    }
});

// Get current user
router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ 
            success: true, 
            user: req.session.user 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Tidak ada sesi aktif' 
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Gagal logout' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logout berhasil' 
        });
    });
});

module.exports = router;