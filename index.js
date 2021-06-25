'use strict'

const express = require('express')
const app = express()

require('./app/config/routes')(app)

const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Listening on port ${port}...`))

module.exports = server