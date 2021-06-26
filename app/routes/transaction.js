const express = require('express')
const router = express.Router()

const interest = require('../json/interest.json')

const db = require('../models')
const Transaction = db.transactions
const TransactionDetail = db.transactionDetails
const Ticket = db.tickets
const Product = db.products
const Credit = db.credits
const CreditDetail = db.creditDetails

router.get('/', async (req, res, next) => {
    try {
        const results = await Transaction.findAll({
            include: [
                {
                    model: TransactionDetail,
                    as: 'transactionDetails'
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
        if (results.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Transaksi tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'List transaksi'
        err.data = results

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

router.get('/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const transaction = await Transaction.findByPk(id, { include: ['credit', 'transactionDetails'] })
        if (transaction == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Transaksi tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Transaksi berhasil diperbarui'
        err.data = transaction

        next(err)
        return
    } catch (error) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = error.message
    
        next(err)
        return
    }
})

router.post('/:id', async (req, res, next) => {
    const ticketId = req.params.id
    const products = req.body.products
    const type = req.body.type ?? 'cash'
    const month = req.body.totalMonth

    if (products == null || type == null) {
        const err = new Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = 'Inputan masih kosong'

        next(err)
        return
    }

    try {
        const ticket = await Ticket.findOne({where: {id: ticketId, status: 'new'}})
        if (ticket == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Tiket tidak ditemukan'

            next(err)
            return
        }

        var transactionId = `INV${ticketId}`

        const detailTransactionState = []
        var totalprice = 0

        for (let i = 0; i < products.length; i++) {
            const productId = products[i].id
            const unit = products[i].unit
            const product = await Product.findByPk(productId)

            if (product != null && unit != null) {
                const state = {
                    transactionId: transactionId,
                    productId: product.id,
                    price: product.price,
                    unit: unit
                }

                totalprice += product.price * unit
                detailTransactionState.push(state)
            }
        }

        const status = type == 'cash' ? 'paid' : 'unpaid'

        const state = {
            id: transactionId,
            ticketId: ticketId,
            type: type,
            totalprice: totalprice,
            status: status
        }

        const result = await Transaction.create(state)

        await TransactionDetail.bulkCreate(detailTransactionState)

        const ticketState = {status: 'used'}
        await Ticket.update(ticketState, {where: {id: ticketId}})

        if (type == 'credit') {
            if (month == null) {
                const err = Error()
                err.statusCode = 500
                err.status = 'error'
                err.message = 'Jumlah bulan angsuran harus diisi'
        
                next(err)
                return
            }

            var creditId = `CR${ticketId}`

            const detailCreditState = []
            var totalCredit = 0
            var totalInterest = interest.interest / 12
            var priceInterest = (totalInterest / 100) * totalprice
            var pricePrincipal = totalprice / month
            var totalprice = parseInt(priceInterest) + parseInt(pricePrincipal)

            for (let i = 1; i <= month; i++) {
                const state = {
                    creditId: creditId,
                    month: i,
                    priceInterest: priceInterest,
                    pricePrincipal: pricePrincipal,
                    totalprice: totalprice
                }

                totalCredit += totalprice
                detailCreditState.push(state)
            }

            const creditState = {
                id: creditId,
                transactionId: transactionId,
                totalMonth: month,
                interest: interest.interest,
                totalCredit: totalCredit
            }

            await Credit.create(creditState)
            await CreditDetail.bulkCreate(detailCreditState)
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Transaksi berhasil'
        err.data = result

        next(err)
        return
    } catch (error) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = error.message
    
        next(err)
        return
    }
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const transaction = await Transaction.findByPk(id)
        if (transaction == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Transaksi tidak ditemukan'

            next(err)
            return
        }

        await Transaction.destroy({where: { id: id }})

        const ticketState = {status: 'new'}
        await Ticket.update(ticketState, {where: {id: transaction.ticketId}})

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Transaksi berhasil dihapus'

        next(err)
        return
    } catch (error) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = error.message
    
        next(err)
        return
    }
})

module.exports = router