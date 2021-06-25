const express = require('express')
const about = require('../json/about.json')
const router = express.Router()

router.get('', async (req, res, next) => {
    var err = Error()
    err.status = 200
    err.message = 'Welcome...'
    err.data = about

    next(err)
})

module.exports = router