module.exports = (sequelize, Sequelize) => {
    const TransactionDetail = sequelize.define('transactionDetails', {
        price: {
            type: Sequelize.INTEGER
        },
        unit: {
            type: Sequelize.INTEGER
        },
    })

    return TransactionDetail
}