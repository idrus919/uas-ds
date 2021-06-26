const express = require('express')
const about = require('../json/about.json')
const router = express.Router()

router.get('', async (req, res, next) => {
    const err = Error()
    err.statusCode = 200
    err.status = 'success'
    err.message = 'Selamat datang...'
    err.data = about

    next(err)
})

module.exports = router