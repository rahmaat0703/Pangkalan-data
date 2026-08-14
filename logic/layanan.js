// logic/layanan.js
const db = require('../config/db');

// Data Layanan (static data)
const layananStaticData = {
    'ukbi': {
        nama: 'UKBI (Uji Kemahiran Berbahasa Indonesia)',
        icon: '📝',
        deskripsi: 'Uji Kemahiran Berbahasa Indonesia (UKBI) adalah tes standar untuk mengukur kemahiran berbahasa Indonesia seseorang.',
        deskripsiLengkap: `
            <p>UKBI (Uji Kemahiran Berbahasa Indonesia) adalah tes standar kemahiran berbahasa Indonesia yang dikembangkan oleh Badan Pengembangan dan Pembinaan Bahasa, Kementerian Pendidikan dan Kebudayaan.</p>
            
            <h4 class="mt-4">Tujuan UKBI</h4>
            <ul>
                <li>Mengukur kemahiran berbahasa Indonesia seseorang</li>
                <li>Memberikan sertifikasi standar kemahiran berbahasa Indonesia</li>
                <li>Memenuhi persyaratan untuk keperluan akademis dan profesional</li>
            </ul>
            
            <h4 class="mt-4">Tingkat Kemahiran UKBI</h4>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>Rentang Skor</th>
                            <th>Predikat</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>725-900</td>
                            <td>Istimewa</td>
                            <td>Sangat mahir</td>
                        </tr>
                        <tr>
                            <td>595-724</td>
                            <td>Sangat Unggul</td>
                            <td>Mahir</td>
                        </tr>
                        <tr>
                            <td>482-594</td>
                            <td>Unggul</td>
                            <td>Semenjana</td>
                        </tr>
                        <tr>
                            <td>369-481</td>
                            <td>Madya</td>
                            <td>Marginal</td>
                        </tr>
                        <tr>
                            <td>277-368</td>
                            <td>Semenjana</td>
                            <td>Terbatas</td>
                        </tr>
                        <tr>
                            <td>0-276</td>
                            <td>Marginal</td>
                            <td>Sangat terbatas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        persyaratan: [
            'Fotokopi KTP/Kartu Identitas yang masih berlaku',
            'Pas foto terbaru ukuran 3x4 (2 lembar)',
            'Mengisi formulir pendaftaran',
            'Membayar biaya tes sesuai ketentuan'
        ],
        prosedur: [
            'Mengisi formulir pendaftaran UKBI',
            'Melengkapi persyaratan yang dibutuhkan',
            'Membayar biaya tes',
            'Mengikuti tes UKBI pada jadwal yang ditentukan',
            'Menerima sertifikat hasil tes'
        ],
        galeri: [
            '/img/layanan/ukbi-1.jpg',
            '/img/layanan/ukbi-2.jpg',
            '/img/layanan/ukbi-3.jpg'
        ]
    },
    
    'ahli-bahasa': {
        nama: 'Ahli Bahasa & Fasilitasi Kebahasaan',
        icon: '📚',
        deskripsi: 'Layanan konsultasi kebahasaan, penyuntingan, dan fasilitasi kegiatan kebahasaan.',
        deskripsiLengkap: `
            <p>Layanan Ahli Bahasa dan Fasilitasi Kebahasaan menyediakan berbagai bentuk bantuan profesional dalam bidang kebahasaan Indonesia.</p>
            
            <h4 class="mt-4">Jenis Layanan</h4>
            <ul>
                <li><strong>Konsultasi Kebahasaan:</strong> Konsultasi mengenai kaidah bahasa Indonesia yang baik dan benar</li>
                <li><strong>Penyuntingan Naskah:</strong> Penyuntingan dokumen, buku, artikel, dan karya tulis lainnya</li>
                <li><strong>Fasilitasi Kegiatan:</strong> Penyediaan narasumber untuk seminar, workshop, dan pelatihan kebahasaan</li>
                <li><strong>Penelaahan Bahasa:</strong> Analisis dan penelaahan penggunaan bahasa dalam berbagai media</li>
            </ul>
            
            <h4 class="mt-4">Siapa yang Membutuhkan?</h4>
            <ul>
                <li>Penulis dan penerbit</li>
                <li>Instansi pemerintah dan swasta</li>
                <li>Lembaga pendidikan</li>
                <li>Media massa</li>
                <li>Masyarakat umum yang membutuhkan konsultasi kebahasaan</li>
            </ul>
        `,
        persyaratan: [
            'Surat permohonan resmi (untuk instansi)',
            'Proposal kegiatan (untuk fasilitasi)',
            'Naskah yang akan dikonsultasikan/disunting',
            'Fotokopi KTP pemohon'
        ],
        prosedur: [
            'Mengajukan permohonan melalui sistem atau datang langsung',
            'Melampirkan dokumen/naskah yang akan dikonsultasikan',
            'Menunggu jadwal konsultasi/penyuntingan',
            'Mengikuti konsultasi atau menerima hasil penyuntingan',
            'Memberikan feedback'
        ],
        galeri: [
            '/img/layanan/ahli-bahasa-1.jpg',
            '/img/layanan/ahli-bahasa-2.jpg',
            '/img/layanan/ahli-bahasa-3.jpg'
        ]
    },
    
    'pkl-magang': {
        nama: 'PKL / Magang',
        icon: '👨‍🎓',
        deskripsi: 'Program Praktik Kerja Lapangan dan Magang di Balai Bahasa Provinsi Lampung.',
        deskripsiLengkap: `
            <p>Program PKL/Magang memberikan kesempatan bagi mahasiswa dan pelajar untuk mendapatkan pengalaman praktis di bidang kebahasaan dan kesastraan.</p>
            
            <h4 class="mt-4">Kegiatan PKL/Magang</h4>
            <ul>
                <li>Membantu kegiatan penelitian kebahasaan dan kesastraan</li>
                <li>Mendokumentasikan kegiatan Balai Bahasa</li>
                <li>Membantu pengelolaan perpustakaan dan arsip</li>
                <li>Mengikuti kegiatan pembinaan dan pengembangan bahasa</li>
                <li>Membuat laporan hasil PKL/Magang</li>
            </ul>
            
            <h4 class="mt-4">Durasi Program</h4>
            <ul>
                <li>PKL: 1-3 bulan</li>
                <li>Magang: 3-6 bulan</li>
            </ul>
            
            <h4 class="mt-4">Manfaat</h4>
            <ul>
                <li>Mendapatkan pengalaman kerja di instansi pemerintah</li>
                <li>Mempraktikkan ilmu yang dipelajari di bangku kuliah</li>
                <li>Membangun networking dengan profesional di bidang kebahasaan</li>
                <li>Mendapatkan sertifikat PKL/Magang</li>
            </ul>
        `,
        persyaratan: [
            'Surat pengantar dari kampus/sekolah',
            'Proposal PKL/Magang',
            'Curriculum Vitae (CV)',
            'Fotokopi KTP dan Kartu Mahasiswa/Pelajar',
            'Pas foto 3x4 (2 lembar)',
            'Surat keterangan sehat dari dokter'
        ],
        prosedur: [
            'Mengajukan surat permohonan PKL/Magang dari kampus/sekolah',
            'Melampirkan proposal dan dokumen persyaratan',
            'Menunggu konfirmasi penerimaan',
            'Mengikuti briefing dan orientasi',
            'Melaksanakan kegiatan PKL/Magang',
            'Membuat laporan akhir',
            'Menerima sertifikat'
        ],
        galeri: [
            '/img/layanan/pkl-1.jpg',
            '/img/layanan/pkl-2.jpg',
            '/img/layanan/pkl-3.jpg'
        ]
    },
    
    'penerjemah': {
        nama: 'Penerjemah',
        icon: '🌐',
        deskripsi: 'Layanan penerjemahan dokumen dari dan ke bahasa Indonesia.',
        deskripsiLengkap: `
            <p>Layanan penerjemahan profesional untuk berbagai jenis dokumen dari dan ke bahasa Indonesia.</p>
            
            <h4 class="mt-4">Jenis Penerjemahan</h4>
            <ul>
                <li>Dokumen resmi (akta, ijazah, sertifikat)</li>
                <li>Dokumen bisnis (kontrak, proposal, laporan)</li>
                <li>Karya ilmiah (jurnal, thesis, artikel)</li>
                <li>Buku dan publikasi</li>
                <li>Dokumen teknis</li>
            </ul>
            
            <h4 class="mt-4">Bahasa yang Dilayani</h4>
            <ul>
                <li>Indonesia - Inggris</li>
                <li>Indonesia - Arab</li>
                <li>Indonesia - Bahasa Daerah</li>
                <li>Dan bahasa lainnya (dengan konfirmasi ketersediaan penerjemah)</li>
            </ul>
            
            <h4 class="mt-4">Standar Penerjemahan</h4>
            <p>Semua penerjemahan dilakukan oleh penerjemah tersumpah dan bersertifikat, dengan hasil terjemahan yang akurat dan sesuai konteks.</p>
        `,
        persyaratan: [
            'Surat permohonan penerjemahan',
            'Dokumen asli yang akan diterjemahkan',
            'Fotokopi KTP pemohon',
            'Menyebutkan bahasa sumber dan bahasa tujuan',
            'Menyebutkan tingkat urgensi'
        ],
        prosedur: [
            'Mengajukan permohonan penerjemahan',
            'Menyerahkan dokumen yang akan diterjemahkan',
            'Mendapatkan estimasi waktu dan biaya',
            'Membayar biaya penerjemahan (jika ada)',
            'Menunggu proses penerjemahan',
            'Menerima hasil terjemahan dan dokumen asli'
        ],
        galeri: [
            '/img/layanan/penerjemah-1.jpg',
            '/img/layanan/penerjemah-2.jpg',
            '/img/layanan/penerjemah-3.jpg'
        ]
    },
    
    'data-informasi': {
        nama: 'Permohonan Data dan Informasi',
        icon: '📊',
        deskripsi: 'Layanan permintaan data dan informasi kebahasaan dan kesastraan.',
        deskripsiLengkap: `
            <p>Layanan penyediaan data dan informasi kebahasaan dan kesastraan untuk keperluan penelitian, akademis, dan umum.</p>
            
            <h4 class="mt-4">Jenis Data dan Informasi</h4>
            <ul>
                <li>Data statistik kebahasaan di Lampung</li>
                <li>Informasi bahasa daerah</li>
                <li>Dokumentasi kegiatan kebahasaan</li>
                <li>Hasil penelitian bahasa dan sastra</li>
                <li>Publikasi dan jurnal kebahasaan</li>
                <li>Arsip dan dokumen historis</li>
            </ul>
            
            <h4 class="mt-4">Peruntukan</h4>
            <ul>
                <li>Penelitian akademis</li>
                <li>Skripsi, thesis, dan disertasi</li>
                <li>Penyusunan kebijakan</li>
                <li>Pengembangan program kebahasaan</li>
                <li>Publikasi media</li>
            </ul>
        `,
        persyaratan: [
            'Surat permohonan data dan informasi',
            'Proposal penelitian atau keterangan penggunaan data',
            'Fotokopi KTP pemohon',
            'Surat pengantar dari instansi (jika ada)'
        ],
        prosedur: [
            'Mengajukan surat permohonan data dan informasi',
            'Menjelaskan tujuan penggunaan data',
            'Menunggu verifikasi dan persetujuan',
            'Menerima data dan informasi yang diminta',
            'Menandatangani surat pernyataan penggunaan data'
        ],
        galeri: [
            '/img/layanan/data-1.jpg',
            '/img/layanan/data-2.jpg',
            '/img/layanan/data-3.jpg'
        ]
    },
    
    'peminjaman-aula': {
        nama: 'Peminjaman Aula Laut Handak',
        icon: '🏢',
        deskripsi: 'Layanan peminjaman Aula Laut Handak untuk kegiatan kebahasaan dan kesastraan.',
        deskripsiLengkap: `
            <p>Aula Laut Handak merupakan fasilitas pertemuan yang dapat digunakan untuk berbagai kegiatan kebahasaan, kesastraan, dan kebudayaan.</p>
            
            <h4 class="mt-4">Fasilitas Aula</h4>
            <ul>
                <li>Kapasitas: 100-150 orang</li>
                <li>AC dan sound system</li>
                <li>Proyektor dan layar</li>
                <li>Kursi dan meja</li>
                <li>Toilet dan mushola</li>
                <li>Area parkir yang luas</li>
            </ul>
            
            <h4 class="mt-4">Kegiatan yang Dapat Dilayani</h4>
            <ul>
                <li>Seminar dan workshop kebahasaan</li>
                <li>Diskusi sastra dan budaya</li>
                <li>Pelatihan dan bimbingan teknis</li>
                <li>Launching buku</li>
                <li>Pertemuan ilmiah</li>
                <li>Kegiatan kebudayaan lainnya</li>
            </ul>
            
            <h4 class="mt-4">Ketentuan Peminjaman</h4>
            <ul>
                <li>Kegiatan harus berkaitan dengan kebahasaan, kesastraan, atau kebudayaan</li>
                <li>Pengajuan minimal 14 hari sebelum kegiatan</li>
                <li>Menjaga kebersihan dan fasilitas aula</li>
                <li>Mematuhi peraturan penggunaan fasilitas</li>
            </ul>
        `,
        persyaratan: [
            'Surat permohonan peminjaman aula',
            'Proposal kegiatan',
            'Fotokopi KTP penanggung jawab',
            'Surat pengantar dari instansi (untuk instansi)',
            'Jadwal rencana kegiatan',
            'Surat pernyataan kesediaan menjaga fasilitas'
        ],
        prosedur: [
            'Mengajukan surat permohonan peminjaman minimal 14 hari sebelum kegiatan',
            'Melampirkan proposal dan persyaratan lengkap',
            'Menunggu survei dan persetujuan',
            'Koordinasi teknis dengan pengelola',
            'Pelaksanaan kegiatan',
            'Serah terima fasilitas setelah kegiatan'
        ],
        galeri: [
            '/img/layanan/aula-1.jpg',
            '/img/layanan/aula-2.jpg',
            '/img/layanan/aula-3.jpg'
        ]
    },
    
    'lainnya': {
        nama: 'Layanan Lainnya',
        icon: '📋',
        deskripsi: 'Keperluan lain yang berkaitan dengan kebahasaan dan kesastraan.',
        deskripsiLengkap: `
            <p>Layanan ini mencakup berbagai keperluan lain yang berkaitan dengan kebahasaan dan kesastraan yang tidak termasuk dalam kategori layanan khusus.</p>
            
            <h4 class="mt-4">Contoh Layanan Lainnya</h4>
            <ul>
                <li>Kunjungan studi atau edukasi</li>
                <li>Wawancara dan liputan media</li>
                <li>Kerja sama penelitian</li>
                <li>Pengembangan program kebahasaan</li>
                <li>Konsultasi kebijakan bahasa</li>
                <li>Layanan khusus sesuai kebutuhan</li>
            </ul>
            
            <h4 class="mt-4">Cara Mengajukan</h4>
            <p>Untuk keperluan lainnya, silakan jelaskan secara detail kebutuhan Anda dalam surat permohonan. Tim kami akan mengevaluasi dan memberikan respons sesuai dengan kewenangan dan kemampuan Balai Bahasa.</p>
        `,
        persyaratan: [
            'Surat permohonan yang menjelaskan keperluan secara detail',
            'Dokumen pendukung sesuai jenis permohonan',
            'Fotokopi KTP pemohon',
            'Surat pengantar instansi (jika diperlukan)'
        ],
        prosedur: [
            'Mengajukan surat permohonan dengan penjelasan lengkap',
            'Melampirkan dokumen pendukung',
            'Menunggu evaluasi dan respons dari Balai Bahasa',
            'Koordinasi lebih lanjut sesuai hasil evaluasi',
            'Pelaksanaan sesuai kesepakatan'
        ],
        galeri: [
            '/img/layanan/lainnya-1.jpg',
            '/img/layanan/lainnya-2.jpg',
            '/img/layanan/lainnya-3.jpg'
        ]
    }
};

// Get layanan by slug (with dokumen from database)
const getLayananBySlug = async (slug) => {
    try {
        const staticData = layananStaticData[slug];
        if (!staticData) return null;
        
        // Get dokumen from database
        const [rows] = await db.query(`
            SELECT * FROM dokumen_layanan 
            WHERE slug_layanan = ? AND is_active = 1
            ORDER BY jenis_dokumen
        `, [slug]);
        
        // Format dokumen paths
        let contohSurat = '#';
        let formatSurat = '#';
        
        rows.forEach(row => {
            if (row.jenis_dokumen === 'contoh_surat') {
                contohSurat = row.path_file;
            } else if (row.jenis_dokumen === 'format_surat') {
                formatSurat = row.path_file;
            }
        });
        
        return {
            ...staticData,
            contohSurat,
            formatSurat
        };
    } catch (error) {
        console.error('Error in getLayananBySlug:', error);
        // Return static data dengan placeholder jika error
        return {
            ...layananStaticData[slug],
            contohSurat: '#',
            formatSurat: '#'
        };
    }
};

// Get all layanan
const getAllLayanan = () => {
    return Object.keys(layananStaticData).map(key => ({
        slug: key,
        nama: layananStaticData[key].nama,
        icon: layananStaticData[key].icon,
        deskripsi: layananStaticData[key].deskripsi
    }));
};

module.exports = {
    getLayananBySlug,
    getAllLayanan
};