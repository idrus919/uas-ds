const { GeneralError } = require('./utils/error')
const express = require('express')
const main = require('./routes')
const error404 = require('./routes/404')
const error = require('./middleware/error')
const success = require('./middleware/success')
const customer = require('./routes/customer')
const ticket = require('./routes/ticket')
const product = require('./routes/product')
const transaction = require('./routes/transaction')
const credit = require('./routes/credit')
const invoice = require('./routes/invoice')

module.exports = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/', main)
    app.use('/api/customer', customer)
    app.use('/api/ticket', ticket)
    app.use('/api/product', product)
    app.use('/api/transaction', transaction)
    app.use('/api/credit', credit)
    app.use('/api/invoice', invoice)

    app.use('*', error404)
    app.use(success)
    app.use(error)
}