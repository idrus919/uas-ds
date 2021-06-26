const Sequelize = require('sequelize')
const config = require('../json/mysql.json')

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    },

    timezone:'+07:00',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.customers = require('./customer')(sequelize, Sequelize)
db.tickets = require('./ticket')(sequelize, Sequelize)
db.products = require('./product')(sequelize, Sequelize)
db.transactions = require('./transaction')(sequelize, Sequelize)
db.transactionDetails = require('./transactionDetail')(sequelize, Sequelize)
db.credits = require('./credit')(sequelize, Sequelize)
db.creditDetails = require('./creditDetail')(sequelize, Sequelize)

db.customers.hasMany(db.tickets, {
    as: 'tickets',
    onDelete: 'CASCADE'
})

db.tickets.belongsTo(db.customers, {
    foreignKey: 'customerId',
    as: 'customer',
})

db.tickets.hasOne(db.transactions, { 
    foreignKey: 'ticketId', 
    as: 'transaction', 
    onDelete: 'CASCADE' 
})

db.transactions.belongsTo(db.tickets, {
    foreignKey: 'ticketId',
    as: 'ticket',
})

db.transactions.hasMany(db.transactionDetails, {
    as: 'transactionDetails',
    onDelete: 'CASCADE'
})

db.transactionDetails.belongsTo(db.products, {
    foreignKey: 'productId',
    as: 'product',
})

db.transactions.hasOne(db.credits, { 
    foreignKey: 'transactionId', 
    as: 'credit', 
    onDelete: 'CASCADE' 
})

db.credits.belongsTo(db.transactions, {
    foreignKey: 'transactionId',
    as: 'transaction',
})

db.credits.hasMany(db.creditDetails, {
    as: 'creditDetails',
    onDelete: 'CASCADE',
    where: {relation : 1}
})

module.exports = db