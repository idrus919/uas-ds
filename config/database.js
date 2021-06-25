class Connection {
    static connect() {
        const connection = null
        const mysql = require('mysql')
        const settings = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'db_toko_elektronik'
        }

        connection = mysql.createConnection(settings)

        connection.connect(function(err) {
            if (err) () => console.log('error when connecting to db:', err)
        })

        return connection
    }
}

module.exports = { Connection }