CREATE DATABASE IF NOT EXISTS Pelayanan_data;
USE Pelayanan_data;

-- Tabel Pengunjung (Konsultasi)
CREATE TABLE IF NOT EXISTS pengunjung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nomor VARCHAR(20) NOT NULL,
    kategori_instansi ENUM('Universitas / Institut', 'Sekolah', 'Umum') NOT NULL,
    nama_instansi VARCHAR(255) NOT NULL,
    keperluan ENUM(
        'Ahli Bahasa & Fasilitasi Kebahasaan',
        'UKBI',
        'Penerjemah',
        'Permohonan Data dan Informasi',
        'PKL / Magang',
        'Peminjaman Aula Handak',
        'Lainnya'
    ) NOT NULL,
    keterangan TEXT,
    file_pendukung VARCHAR(255),
    status ENUM('Menunggu', 'Diproses', 'Selesai', 'Ditolak') DEFAULT 'Menunggu',
    tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_diupdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Karyawan
CREATE TABLE IF NOT EXISTS karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    jabatan VARCHAR(255),
    role ENUM('admin', 'pegawai') DEFAULT 'pegawai',
    foto VARCHAR(255),
    tanggal_bergabung DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Izin (Keluar-Masuk Kantor)
CREATE TABLE IF NOT EXISTS izin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    karyawan_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jam_keluar TIME NOT NULL,
    jam_kembali TIME,
    keterangan TEXT,
    status ENUM('Menunggu', 'Disetujui', 'Ditolak') DEFAULT 'Menunggu',
    catatan_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE
);

-- Tabel Pelanggaran
CREATE TABLE IF NOT EXISTS pelanggaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    karyawan_id INT NOT NULL,
    jenis_pelanggaran VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    deskripsi TEXT,
    sanksi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (karyawan_id) REFERENCES karyawan(id) ON DELETE CASCADE
);



-- Insert Admin Default
INSERT INTO karyawan (nip, nama, email, password, jabatan, role) VALUES
('admin001', 'Administrator', 'admin@balaibahasa.com', 'admin123', 'Administrator', 'admin'),
('19850101', 'Dr. Ahmad Suryana, M.Pd.', 'ahmad.suryana@balaibahasa.com', 'password123', 'Kepala Balai', 'pegawai'),
('19900215', 'Siti Rahma, S.S., M.Hum.', 'siti.rahma@balaibahasa.com', 'password123', 'Kepala Subbagian Tata Usaha', 'pegawai'),
('19920520', 'Budi Santoso, S.Pd., M.Pd.', 'budi.santoso@balaibahasa.com', 'password123', 'Kepala Seksi Pengembangan', 'pegawai'),
('19880710', 'Dewi Lestari, S.S.', 'dewi.lestari@balaibahasa.com', 'password123', 'Staff Peneliti', 'pegawai'),
('19950320', 'Rudi Hartono, S.Kom.', 'rudi.hartono@balaibahasa.com', 'password123', 'Staff IT', 'pegawai');

-- Insert Sample Data Konsultasi
INSERT INTO pengunjung (nama, email, nomor, kategori_instansi, nama_instansi, keperluan, status) VALUES
('Andi Wijaya', 'andi.wijaya@unila.ac.id', '081234567890', 'Universitas / Institut', 'Universitas Lampung', 'UKBI', 'Selesai'),
('Sari Kusuma', 'sari.kusuma@gmail.com', '081234567891', 'Sekolah', 'SMA Negeri 1 Bandar Lampung', 'PKL / Magang', 'Diproses'),
('Bambang Prasetyo', 'bambang@gmail.com', '081234567892', 'Umum', 'Pribadi', 'Ahli Bahasa & Fasilitasi Kebahasaan', 'Menunggu'),
('Linda Maharani', 'linda@gmail.com', '081234567893', 'Universitas / Institut', 'Institut Teknologi Sumatera', 'Penerjemah', 'Selesai'),
('Dedi Susanto', 'dedi@gmail.com', '081234567894', 'Umum', 'PT Maju Jaya', 'Permohonan Data dan Informasi', 'Diproses'),
('Fitri Handayani', 'fitri@gmail.com', '081234567895', 'Sekolah', 'SMK Negeri 2 Bandar Lampung', 'Peminjaman Aula Handak', 'Selesai'),
('Ahmad Fauzi', 'ahmad.fauzi@gmail.com', '081234567896', 'Universitas / Institut', 'Universitas Lampung', 'PKL / Magang', 'Selesai'),
('Nina Safitri', 'nina@gmail.com', '081234567897', 'Umum', 'Pribadi', 'UKBI', 'Menunggu'),
('Hendra Gunawan', 'hendra@gmail.com', '081234567898', 'Sekolah', 'SMA Negeri 5 Bandar Lampung', 'Lainnya', 'Diproses'),
('Ratih Puspita', 'ratih@gmail.com', '081234567899', 'Universitas / Institut', 'Universitas Muhammadiyah Lampung', 'Ahli Bahasa & Fasilitasi Kebahasaan', 'Selesai');