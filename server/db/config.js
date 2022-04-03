const mysql = require('mysql2');
// const nopt = require('nopt');

// var longOpts = {
//     "host": String,
//     "userId": String,
//     "userPassword": String,
//     "database": String
// };

// var shortOpts = {
//     "h": ["--host"],
//     "i": ["--userId"],
//     "p": ["--userPassword"],
//     "d": ["--database"]
// };

// const parsed = nopt(longOpts, shortOpts, process.argv, 1);

// console.log(parsed);


const db = mysql.createConnection({
    host: process.argv[2],
    user: process.argv[3],
    password: process.argv[4],
    port: 3306,
    database: process.argv[5],
    ssl : {
        rejectUnauthorized: false
    }
});

db.connect();


module.exports = db;