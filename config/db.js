const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'hayabusa.proxy.rlwy.net',
    port: 38955,
    user: 'root',
    password: 'bmhMsLqeZifHnCKAcZkfolEXvNCQopJY',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;