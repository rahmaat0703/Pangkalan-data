// Logic untuk data footer website - DIPAKAI AKTIF

const footerData = {
    nama: 'Balai Bahasa Provinsi Lampung',
    alamat: {
        jalan: 'Jl. Beringin II No. 40',
        kelurahan: 'Talang',
        kecamatan: 'Telukbetung Selatan',
        kota: 'Bandar Lampung',
        provinsi: 'Lampung',
        kodePos: '5221'
    },
    kontak: {
        telepon: '(0721) 787218',
        fax: '(0721) 787218',
        email: 'balaibahasa.lampung@kemdikbud.go.id',
        website: 'balaibahasalampung.kemendikdasmen.go.id'
    },
    maps: {
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8325440279873!2d105.25464807401448!3d-5.442381054290305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da29ec461e89%3A0x223d1ec6e7959b68!2sBalai%20Bahasa%20Provinsi%20Lampung.!5e0!3m2!1sid!2sid!4v1767941175486!5m2!1sid!2sid',
        link: 'https://maps.app.goo.gl/bbx4rA1wP9GsbGqa8'
    },
    jamOperasional: {
        senin: '08:00 - 16:00 WIB',
        selasa: '08:00 - 16:00 WIB',
        rabu: '08:00 - 16:00 WIB',
        kamis: '08:00 - 16:00 WIB',
        jumat: '08:00 - 16:30 WIB',
        sabtu: 'Tutup',
        minggu: 'Tutup'
    },
    sosialMedia: {
        facebook: 'https://facebook.com/balaibahasa.lampung',
        instagram: 'https://instagram.com/balaibahasa.lampung',
        twitter: 'https://twitter.com/balaibahasa_lpg',
        youtube: 'https://youtube.com/@balaibahasalampung'
    }
};

// Function untuk mendapatkan alamat lengkap
function getAlamatLengkap() {
    const a = footerData.alamat;
    return `${a.jalan}, ${a.kelurahan}, ${a.kecamatan}, ${a.kota}, ${a.provinsi} ${a.kodePos}`;
}

// Function untuk mendapatkan jam operasional hari ini
function getJamOperasionalHariIni() {
    const hari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const hariIni = hari[new Date().getDay()];
    return footerData.jamOperasional[hariIni];
}

module.exports = {
    footerData,
    getAlamatLengkap,
    getJamOperasionalHariIni
};