const { GeneralError } = require('../utils/error')
const express = require('express')
const main = require('../routes/main')
const error404 = require('../routes/404')
const error = require('../middleware/error')
const success = require('../middleware/success')

module.exports = function(app) {
    app.use('/', main)
    app.use('*', error404)
    app.use(success)
    app.use(error)
}