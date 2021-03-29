require('babel-register')
const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    database: 'nodejs',
    user: 'root',
    password: ''
})

db.connect((err) => {
    if(err) {
       console.error(err.message)
    } else {
        console.log('Connected.')
        db.query(`SELECT * FROM members`, (err, result) => {
            if(err) {
                console.error(err.message)
            } else {
                console.log(result[0].name)
            }
        })
    }
})
