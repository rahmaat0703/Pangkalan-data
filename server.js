const express = require('express');
const path = require('path');
const session = require('express-session');
const sessionConfig = require('./config/session');

const app = express();

// Render akan memberikan PORT melalui environment variable.
// Saat dijalankan di komputer lokal, tetap menggunakan port 3000.
const PORT = process.env.PORT || 3000;

// Import layanan logic
const { getLayananBySlug, getAllLayanan } = require('./logic/layanan');
const dokumenLogic = require('./logic/dokumen');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads')); // Serving uploaded files
app.use(session(sessionConfig));

// Routes
const authRoutes = require('./routes/auth');
const pengunjungRoutes = require('./routes/pengunjung');
const pegawaiRoutes = require('./routes/pegawai');
const adminRoutes = require('./routes/admin');
const exportRoutes = require('./routes/export');

app.use('/api/auth', authRoutes);
app.use('/api/pengunjung', pengunjungRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/export', exportRoutes);

// ============================================
// LAYANAN API ENDPOINTS
// ============================================

// API untuk get data layanan by slug
app.get('/api/layanan/:slug', (req, res) => {
    const slug = req.params.slug;
    const layanan = getLayananBySlug(slug);

    if (!layanan) {
        return res.status(404).json({
            success: false,
            message: 'Layanan tidak ditemukan'
        });
    }

    res.json({
        success: true,
        data: {
            slug: slug,
            ...layanan
        }
    });
});

// API untuk get all layanan
app.get('/api/layanan', (req, res) => {
    const layanan = getAllLayanan();

    res.json({
        success: true,
        data: layanan
    });
});

// ============================================
// DOKUMEN API ENDPOINTS (Public)
// ============================================

// Get dokumen by kategori (untuk pengunjung)
app.get('/api/dokumen/kategori/:kategori', async (req, res) => {
    try {
        const kategori = decodeURIComponent(req.params.kategori);

        console.log('Fetching dokumen for kategori:', kategori);

        const dokumen = await dokumenLogic.getDokumenByKategori(kategori);

        console.log('Found dokumen:', dokumen.length);

        res.json({
            success: true,
            data: dokumen
        });
    } catch (error) {
        console.error('Error fetching dokumen:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil dokumen',
            error: error.message
        });
    }
});

// Download dokumen (untuk pengunjung)
app.get('/api/dokumen/download/:id', async (req, res) => {
    try {
        const dokumen = await dokumenLogic.getDokumenById(req.params.id);

        if (!dokumen) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan'
            });
        }

        // Increment download count
        await dokumenLogic.incrementDownload(req.params.id);

        // Send file
        const filePath = path.join(
            __dirname,
            'public',
            dokumen.file_path
        );

        res.download(filePath, dokumen.nama_file);

    } catch (error) {
        console.error('Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mendownload dokumen'
        });
    }
});

// ============================================
// PENGUNJUNG ROUTES
// ============================================

// Homepage
app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'views', 'pengunjung', 'index.html')
    );
});

app.get('/Layanan', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'views', 'pengunjung', 'layanan.html')
    );
});

// Ajukan konsultasi
app.get('/ajukan-konsultasi', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pengunjung',
            'ajukan-konsultasi.html'
        )
    );
});

// Daftar konsultasi
app.get('/daftar-konsultasi', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pengunjung',
            'daftar-konsultasi.html'
        )
    );
});

// Detail konsultasi
app.get('/detail/:id', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pengunjung',
            'detail.html'
        )
    );
});

// ============================================
// LAYANAN ROUTES
// ============================================

// Route untuk halaman layanan
app.get('/layanan/:slug', (req, res) => {
    const slug = req.params.slug;
    const layanan = getLayananBySlug(slug);

    if (!layanan) {
        return res.status(404).send('Layanan tidak ditemukan');
    }

    // Mapping slug ke nama file
    const fileMapping = {
        'ukbi': 'ukbi.html',
        'ahli-bahasa': 'ahli-bahasa.html',
        'pkl-magang': 'pkl-magang.html',
        'penerjemah': 'penerjemah.html',
        'data-informasi': 'data-informasi.html',
        'peminjaman-aula': 'peminjaman-aula.html',
        'lainnya': 'lainnya.html'
    };

    const fileName = fileMapping[slug];

    if (!fileName) {
        return res.status(404).send(
            'Halaman layanan tidak ditemukan'
        );
    }

    res.sendFile(
        path.join(
            __dirname,
            'views',
            'layanan',
            fileName
        )
    );
});

// ============================================
// LOGIN ROUTE
// ============================================

app.get('/login', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'views', 'login.html')
    );
});

// ============================================
// PEGAWAI ROUTES
// ============================================

app.get('/pegawai/dashboard', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pegawai',
            'dashboard.html'
        )
    );
});

app.get('/pegawai/profil', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pegawai',
            'profil.html'
        )
    );
});

app.get('/pegawai/izin', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pegawai',
            'izin.html'
        )
    );
});

app.get('/pegawai/status', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pegawai',
            'status.html'
        )
    );
});

app.get('/pegawai/ganti-password', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'pegawai',
            'ganti-password.html'
        )
    );
});

// ============================================
// ADMIN ROUTES
// ============================================

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'dashboard.html'
        )
    );
});

app.get('/admin/data-pegawai', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'data-pegawai.html'
        )
    );
});

app.get('/admin/verifikasi-izin', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'verifikasi-izin.html'
        )
    );
});

app.get('/admin/pelanggaran', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'pelanggaran.html'
        )
    );
});

app.get('/admin/laporan', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'laporan.html'
        )
    );
});

app.get('/admin/konsultasi', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'konsultasi.html'
        )
    );
});

// Route untuk halaman dokumen layanan (ADMIN)
app.get('/admin/dokumen-layanan', (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            'views',
            'admin',
            'dokumen-layanan.html'
        )
    );
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Halaman Tidak Ditemukan</title>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            >

            <style>
                body {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                    color: white;
                }
            </style>
        </head>

        <body>
            <div class="text-center">
                <h1 class="display-1 fw-bold">404</h1>
                <p class="fs-3">Halaman tidak ditemukan</p>
                <p class="lead">
                    Maaf, halaman yang Anda cari tidak tersedia.
                </p>

                <a
                    href="/"
                    class="btn btn-light btn-lg mt-3"
                >
                    Kembali ke Beranda
                </a>
            </div>
        </body>
        </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>500 - Server Error</title>

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            >

            <style>
                body {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(
                        135deg,
                        #eb3349 0%,
                        #f45c43 100%
                    );
                    color: white;
                }
            </style>
        </head>

        <body>
            <div class="text-center">
                <h1 class="display-1 fw-bold">500</h1>
                <p class="fs-3">Internal Server Error</p>
                <p class="lead">
                    Terjadi kesalahan pada server.
                    Silakan coba lagi nanti.
                </p>

                <a
                    href="/"
                    class="btn btn-light btn-lg mt-3"
                >
                    Kembali ke Beranda
                </a>
            </div>
        </body>
        </html>
    `);
});

// ============================================
// START SERVER
// ============================================

const server = app.listen(
    PORT,
    '0.0.0.0',
    () => {
        console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║    🚀 Server Balai Bahasa Provinsi Lampung 🚀       ║
║                                                      ║
║    Server berjalan di port: ${PORT}                 ║
║                                                      ║
║    📌 Endpoints yang tersedia:                      ║
║    ├─ Homepage: /                                   ║
║    ├─ Login: /login                                 ║
║    ├─ Ajukan: /ajukan-konsultasi                    ║
║    └─ Layanan: /layanan/...                         ║
║                                                      ║
║    📚 Layanan yang tersedia:                        ║
║    ├─ /layanan/ukbi                                 ║
║    ├─ /layanan/ahli-bahasa                          ║
║    ├─ /layanan/pkl-magang                           ║
║    ├─ /layanan/penerjemah                           ║
║    ├─ /layanan/data-informasi                       ║
║    ├─ /layanan/peminjaman-aula                      ║
║    └─ /layanan/lainnya                              ║
║                                                      ║
║    🔧 API Endpoints:                                ║
║    ├─ GET /api/layanan                              ║
║    ├─ GET /api/layanan/:slug                        ║
║    ├─ GET /api/dokumen/kategori/:kategori           ║
║    └─ GET /api/dokumen/download/:id                 ║
║                                                      ║
║    👨‍💼 Admin:                                        ║
║    └─ /admin/dokumen-layanan                        ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
        `);
    }
);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');

    server.close(() => {
        console.log('HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 Server shutting down gracefully...');

    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});