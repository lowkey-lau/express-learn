const mysql = require('mysql')

const db  = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'lowkey139742685A',
    database: 'mysql'
})

module.exports = db