const mysql = require('mysql')

const db  = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'a123456A',
    database: 'mysql'
})

module.exports = db