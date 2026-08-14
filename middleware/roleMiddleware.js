const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Akses ditolak. Hanya admin yang diizinkan.' 
    });
};

const isPegawai = (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.role === 'pegawai' || req.session.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ 
        success: false, 
        message: 'Akses ditolak. Hanya pegawai yang diizinkan.' 
    });
};

// Backward compatibility alias
const isKaryawan = isPegawai;

module.exports = { isAdmin, isPegawai, isKaryawan };