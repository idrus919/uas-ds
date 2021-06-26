const express = require('express')
const router = express.Router()

const db = require('../models')
const Ticket = db.tickets
const Customer = db.customers

router.get('/', async (req, res, next) => {
    try {
        const results = await Ticket.findAll()

        if (results.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Tiket tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'List Tiket'
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
        const ticket = await Ticket.findByPk(id)
        if (ticket == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Tiket tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Tiket ditemukan'
        err.data = ticket

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
    const customerId = req.params.id

    try {
        const customer = await Customer.findByPk(customerId)
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Tiket tidak ditemukan'

            next(err)
            return
        }

        const state = {
            id: Date.now() /1000 |0,
            customerId: customerId
        }
        const result = await Ticket.create(state)

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Tiket berhasil dibuat'
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
        const ticket = await Ticket.findByPk(id)
        if (ticket == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Tiket tidak ditemukan'

            next(err)
            return
        }

        await Ticket.destroy({where: { id: id }})

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Tiket berhasil dihapus'

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