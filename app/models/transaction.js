module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transactions', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        type: {
            type: Sequelize.ENUM('cash', 'credit'),
            defaultValue: 'cash'
        },
        totalprice: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('paid', 'unpaid'),
            defaultValue: 'unpaid'
        },
    })

    return Transaction
}