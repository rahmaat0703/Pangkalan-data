// Logic untuk keperluan konsultasi dan statistik - DIPAKAI AKTIF

const keperluanKonsultasi = [
    {
        id: 'ahli-bahasa',
        nama: 'Ahli Bahasa & Fasilitasi Kebahasaan',
        deskripsi: 'Konsultasi mengenai kaidah bahasa Indonesia, penyuntingan, dan fasilitasi kebahasaan',
        icon: '📚'
    },
    {
        id: 'ukbi',
        nama: 'UKBI',
        deskripsi: 'Uji Kemahiran Berbahasa Indonesia untuk mengukur kemampuan berbahasa Indonesia',
        icon: '📝'
    },
    {
        id: 'penerjemah',
        nama: 'Penerjemah',
        deskripsi: 'Layanan penerjemahan dokumen dari dan ke bahasa Indonesia',
        icon: '🌐'
    },
    {
        id: 'data-informasi',
        nama: 'Permohonan Data dan Informasi',
        deskripsi: 'Permintaan data dan informasi kebahasaan dan kesastraan',
        icon: '📊'
    },
    {
        id: 'pkl-magang',
        nama: 'PKL / Magang',
        deskripsi: 'Pengajuan Praktik Kerja Lapangan atau Magang di Balai Bahasa',
        icon: '👨‍🎓'
    },
    {
        id: 'aula',
        nama: 'Peminjaman Aula Handak',
        deskripsi: 'Permohonan peminjaman Aula Handak untuk kegiatan kebahasaan',
        icon: '🏢'
    },
    {
        id: 'lainnya',
        nama: 'Lainnya',
        deskripsi: 'Keperluan lain yang berkaitan dengan kebahasaan dan kesastraan',
        icon: '📋'
    }
];

// Function untuk mendapatkan semua keperluan
function getAllKeperluan() {
    return keperluanKonsultasi;
}

// Function untuk mendapatkan keperluan berdasarkan ID
function getKeperluanById(id) {
    return keperluanKonsultasi.find(k => k.id === id);
}

// Function untuk mendapatkan nama keperluan
function getKeperluanNames() {
    return keperluanKonsultasi.map(k => k.nama);
}

// Function untuk statistik (digunakan untuk grafik)
function processStatistikKeperluan(data) {
    const statistik = {};
    
    keperluanKonsultasi.forEach(k => {
        statistik[k.nama] = 0;
    });
    
    data.forEach(item => {
        if (statistik.hasOwnProperty(item.keperluan)) {
            statistik[item.keperluan]++;
        }
    });
    
    return statistik;
}

// Function untuk warna grafik yang aesthetic
function getChartColors() {
    return [
        '#4169E1', // Royal Blue
        '#32CD32', // Lime Green
        '#FF6B6B', // Red
        '#FFA500', // Orange
        '#9370DB', // Medium Purple
        '#20B2AA', // Light Sea Green
        '#FF69B4'  // Hot Pink
    ];
}

module.exports = {
    keperluanKonsultasi,
    getAllKeperluan,
    getKeperluanById,
    getKeperluanNames,
    processStatistikKeperluan,
    getChartColors
};