const express = require('express')
const router = express.Router()

const db = require('../models')
const Credit = db.credits
const Transaction = db.transactions
const CreditDetail = db.creditDetails

router.get('/', async (req, res, next) => {
    try {
        const results = await Credit.findAll({include: ['transaction', 'creditDetails']})
        if (results.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Angsuran masih kosong'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'List angsuran'
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
        const credit = await Credit.findOne({where: {id: id}, include: ['transaction', 'creditDetails']})
        if (credit == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Angsuran tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Angsuran berhasil ditemukan'
        err.data = credit

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

router.put('/:id/:month', async (req, res, next) => {
    const id = req.params.id
    const month = req.params.month

    try {
        const credit = await Credit.findOne({where: {transactionId: id}, include: ['transaction', 'creditDetails']})
        if (credit == null) {
            const err = Error()
            err.statusCode = 200
            err.status = 'success'
            err.message = 'Angsuran tidak ditemukan'
            err.data = null

            next(err)
            return
        }

        const transaction = credit.transaction
        if (transaction.status == 'paid') {
            const err = Error()
            err.statusCode = 200
            err.status = 'success'
            err.message = 'Angsuran sudah lunas'

            next(err)
            return
        }

        const creditDetails = credit.creditDetails

        const hasCredit = creditDetails.filter((e) => e.month == month) ?? []
        if (hasCredit.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = `Bulan ${month} tidak ditemukan diangsuran Anda`

            next(err)
            return
        }

        const creditUnpaid = creditDetails.filter((e) => e.status == 'unpaid') ?? []
        const creditPaid = creditDetails.filter((e) => e.status == 'paid') ?? []

        const isPaid = creditPaid.filter((e) => e.month == month) ?? []
        if (isPaid.length > 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = `Angsuran bulan ${month} sudah lunas`

            next(err)
            return
        }

        const creditMustPay = creditUnpaid[0]

        if (creditMustPay.month != month) {
            const err = Error()
            err.statusCode = 500
            err.status = 'success'
            err.message = 'Masih terdapat angsuran yang harus dibayar'
            err.data = creditUnpaid[0]

            next(err)
            return
        }

        const state = { status: 'paid' }
        await CreditDetail.update(state, {where: {id: creditMustPay.id}})

        if (creditUnpaid[creditUnpaid.length - 1].month == month) {
            await Transaction.update(state, {where: {id: credit.transactionId}})
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = `Angsuran bulan ${creditMustPay.month} sudah dibayar`
        err.data = creditMustPay

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