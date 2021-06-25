const express = require('express')
const app = express()

app.get('', function(req, res, next) {
    var err = Error()
    err.status = 404
    err.message = 'Unable to find the requested resource'

    next(err)
})

module.exports = app