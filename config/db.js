const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql.railway.internal',
    port: 3306,
    user: 'root',
    password: 'bmhMsLqeZifHnCKAcZkfolEXvNCQopJY',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;