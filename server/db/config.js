const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.argv[2],
    user: process.argv[3],
    password: process.argv[4],
    port: 3306,
    database: process.argv[5],
    connectionLimit: 100,
    ssl : {
        rejectUnauthorized: false
    }
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('connection', function (connection) {
    console.log('connection', connection.threadId);
    // connection.query('SET SESSION auto_increment_increment=1')
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});
module.exports = pool;