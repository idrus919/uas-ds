const express = require('express')
const router = express.Router()

const db = require('../models')
const Customer = db.customers

router.get('/', async (req, res, next) => {
    try {
        const results = await Customer.findAll({
            include: ['tickets']
        })

        if (results.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Pelanggan tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'List pelanggan'
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
        const customer = await Customer.findByPk(id, { include: ['tickets'] })
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Pelanggan tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Pelanggan ditemukan'
        err.data = customer

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

router.post('/', async (req, res, next) => {
    const name = req.body.name
    const address = req.body.address

    if (name == null || address == null) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = 'Inputan masih kosong'

        next(err)
        return
    }

    try {
        const result = await Customer.create(req.body)

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Pelanggan berhasil disimpan'
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

router.put('/:id', async (req, res, next) => {
    const id = req.params.id
    const name = req.body.name
    const address = req.body.address

    if (name == null || address == null) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = 'Inputan masih kosong'

        next(err)
        return
    }

    try {
        const customer = await Customer.findByPk(id)
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Pelanggan tidak ditemukan'

            next(err)
            return
        }

        await Customer.update(req.body, {where: {id: id}})
        const result = await Customer.findByPk(id)

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Pelanggan berhasil diperbarui'
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
        const customer = await Customer.findByPk(id)
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Pelanggan tidak ditemukan'
            err.data = null

            next(err)
            return
        }

        await Customer.destroy({where: { id: id }})

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Pelanggan berhasil dihapus'

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