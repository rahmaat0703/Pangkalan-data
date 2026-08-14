const mysql = require('mysql2');

console.log('================================');
console.log('🔌 DATABASE CONNECTION');
console.log('================================');
console.log('Host     : altaria.proxy.rlwy.net');
console.log('Port     : 46732');
console.log('Database : railway');
console.log('User     : root');
console.log('Connecting...');

const pool = mysql.createPool({
    host: 'altaria.proxy.rlwy.net',
    port: 46732,
    user: 'root',
    password: 'uiChLwFleUFCOcKKRtSVuqDYRdxwkbxza',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

promisePool.getConnection()
    .then(connection => {
        console.log('================================');
        console.log('✅ DATABASE CONNECTED');
        console.log('================================');

        connection.release();
    })
    .catch(error => {
        console.log('================================');
        console.log('❌ DATABASE CONNECTION FAILED');
        console.log('Code    :', error.code);
        console.log('Message :', error.message);
        console.log('================================');
    });

module.exports = promisePool;