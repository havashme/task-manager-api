const mysql = require("mysql2")

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "gungame2",
    database : "task_manager",
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0,
})


module.exports = pool.promise()









