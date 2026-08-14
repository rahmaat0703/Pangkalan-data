const mysql = require('mysql2');

const pool = mysql.createPool(
    'mysql://root:bmhMsLqeZifHnCKAcZkfolEXvNCQopJY@hayabusa.proxy.rlwy.net:38955/railway'
);

const promisePool = pool.promise();

module.exports = promisePool;