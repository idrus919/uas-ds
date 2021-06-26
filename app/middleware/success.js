module.exports = function(err, req, res, next) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        data: err.data
    })
}