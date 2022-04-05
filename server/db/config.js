const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.argv[2],
    user: process.argv[3],
    password: process.argv[4],
    port: 3306,
    database: process.argv[5],
    ssl : {
        rejectUnauthorized: false
    }
});

module.exports = pool;