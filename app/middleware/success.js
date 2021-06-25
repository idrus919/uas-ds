module.exports = function(err, req, res, next) {
    res.status(err.status).json({
        status: 'success',
        message: err.message,
        data: err.data
    })
}