class Connection {
    static connect() {
        const config = require('../json/mysql.json')
        const mysql = require('mysql')
        const connection = null
        const settings = {
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        }

        connection = mysql.createConnection(settings)

        connection.connect(function(err) {
            if (err) () => res.status(500).send('Something failed: ', err)
        })

        return connection
    }
}

module.exports = { Connection }