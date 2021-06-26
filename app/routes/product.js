const express = require('express')
const router = express.Router()

const db = require('../models')
const Product = db.products

router.get('/', async (req, res, next) => {
    try {
        const results = await Product.findAll()

        if (results.length == 0) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Produk tidak ditemukan'

            next(err)
            return
        }

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'List produk'
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
        const customer = await Product.findByPk(id)

        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Produk tidak ditemukan'

            next(err)
            return
        }
        

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Produk ditemukan'
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
    const price = parseInt(req.body.price)

    if (name == null || price == null || !Number.isInteger(price)) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = 'Inputan masih kosong atau tidak sesuai'

        next(err)
        return
    }

    try {
        const result = await Product.create(req.body)

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Produk berhasil disimpan'
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
    const price = parseInt(req.body.price)

    if (name == null || price == null || !Number.isInteger(price)) {
        const err = Error()
        err.statusCode = 500
        err.status = 'error'
        err.message = 'Inputan masih kosong atau tidak sesuai'

        next(err)
        return
    }

    try {
        const customer = await Product.findByPk(id)
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Produk tidak ditemukan'

            next(err)
            return
        }

        await Product.update(req.body, {where: {id: id}})
        const result = await Product.findByPk(id)

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Produk berhasil diperbarui'
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
        const customer = await Product.findByPk(id)
        if (customer == null) {
            const err = Error()
            err.statusCode = 500
            err.status = 'error'
            err.message = 'Produk tidak ditemukan'

            next(err)
            return
        }

        await Product.destroy({where: { id: id }})

        const err = Error()
        err.statusCode = 200
        err.status = 'success'
        err.message = 'Produk berhasil dihapus'

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