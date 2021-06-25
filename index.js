const express = require('express')
const about = require('./app/json/about.json')
const app = express()

require('./app/config/routes')(app)

app.get('/', (req, res) => {
    res.json(about)
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Listening on port ${port}...`))

module.exports = server