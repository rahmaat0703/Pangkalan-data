const mysql = require('mysql2');

const dbUrl = process.env.MYSQL_URL;

console.log('==========================================');
console.log('DATABASE DEBUG');
console.log('MYSQL_URL tersedia:', !!dbUrl);

if (dbUrl) {
    try {
        const url = new URL(dbUrl);

        console.log('DB Host:', url.hostname);
        console.log('DB Port:', url.port);
        console.log('DB User:', url.username);
        console.log('DB Name:', url.pathname.replace('/', ''));
    } catch (error) {
        console.error('MYSQL_URL tidak valid:', error.message);
    }
} else {
    console.error('MYSQL_URL TIDAK DITEMUKAN!');
}

console.log('==========================================');

const pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Test koneksi database saat server mulai
promisePool.getConnection()
    .then(connection => {
        console.log('==========================================');
        console.log('DATABASE CONNECTED ✅');
        console.log('MySQL Railway berhasil terhubung.');
        console.log('==========================================');

        connection.release();
    })
    .catch(error => {
        console.error('==========================================');
        console.error('DATABASE CONNECTION FAILED ❌');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('==========================================');
    });

module.exports = promisePool;