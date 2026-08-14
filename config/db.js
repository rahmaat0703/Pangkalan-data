const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql.railway.internal',
    user: 'root',
    password: 'uiChLwFleUFCOcKKRtSVuqDYRdxwkbxz',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
