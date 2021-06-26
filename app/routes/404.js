const express = require('express')
const router = express.Router()

router.get('', function(req, res, next) {
    const err = Error()
    err.statusCode = 404
    err.status = 'error'
    err.message = 'Page not found'

    next(err)
    return
})

router.post('', function(req, res, next) {
    const err = Error()
    err.statusCode = 404
    err.status = 'error'
    err.message = 'Page not found'

    next(err)
    return
})

router.put('', function(req, res, next) {
    const err = Error()
    err.statusCode = 404
    err.status = 'error'
    err.message = 'Page not found'

    next(err)
    return
})

router.delete('', function(req, res, next) {
    const err = Error()
    err.statusCode = 404
    err.status = 'error'
    err.message = 'Page not found'

    next(err)
    return
})

module.exports = router