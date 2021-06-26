const { GeneralError } = require('../utils/error')

module.exports = function(err, req, res, next) {
    if (err instanceof GeneralError) {
        res.status(err.getCode()).json({
            status: 'error',
            message: err
        })
    }

    res.status(500).json({
        status: 'error',
        message: err
    })
}