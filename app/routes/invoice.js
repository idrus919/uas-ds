const express = require('express')
const router = express.Router()

const db = require('../models')
const Transaction = db.transactions
const TransactionDetail = db.transactionDetails
const Ticket = db.tickets
const Customer = db.customers
const Product = db.products
const Credit = db.credits
const CreditDetail = db.creditDetails

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const invoice = await Transaction.findOne({
            where: { id: id },
            include: [
                {
                    model: Ticket,
                    as: 'ticket',
                    include:[
                        {
                            model: Customer,
                            as: 'customer'
                        }
                    ]
                },
                {
                    model: TransactionDetail,
                    as: 'transactionDetails',
                    include:[
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                },
                {
                    model: Credit,
                    as: 'credit',
                    include:[
                        {
                            model: CreditDetail,
                            as: 'creditDetails'
                        }
                    ]
                }
            ]
        })

        if (invoice.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Invoice tidak ditemukan'

            next(err)
            return
        }

        const result = {}
        result.invoiceNumber = invoice.id
        result.ticketNumber = invoice.ticketId
        result.status = invoice.status == 'paid' ? 'Lunas' : 'Belum Lunas'
        result.price = invoice.totalprice

        result.customer = {
            name: invoice.ticket.customer.name,
            address: invoice.ticket.customer.address
        }

        const transactionDetails = invoice.transactionDetails ?? []
        result.orders = []
        transactionDetails.forEach(e => {
            const order = {
                product: e.product.name,
                price: e.price,
                unit: e.unit,
                totalPrice: parseInt(e.price) * parseInt(e.unit)
            }

            result.orders.push(order)
        })

        if (invoice.type == 'cash') {
            result.type = 'Tunai'
            result.totalprice = invoice.totalprice
        }
        else {
            result.type = 'Angsur'
            result.totalprice = invoice.credit.totalCredit

            result.credit = {}

            result.credit.totalMonth = invoice.credit.totalMonth
            result.credit.interest = invoice.credit.interest

            const creditDetails = invoice.credit.creditDetails ?? []
            result.credit.list = []
            creditDetails.forEach(e => {
                const credit = {
                    month: e.month,
                    priceInterest: e.priceInterest,
                    pricePrincipal: e.pricePrincipal,
                    totalprice: e.totalprice,
                    status: e.status == 'paid' ? 'Lunas' : 'Belum Lunas'
                }

                result.credit.list.push(credit)
            })
        }
        result.date = invoice.updatedAt

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Invoice ditemukan'
        err.data = result

        next(err)
        return
    } catch (error) {
        const err = Error()
        error.statusCode = 500
        error.status = 'error'
        error.message = error.message
    
        next(error)
        return
    }
})

module.exports = router