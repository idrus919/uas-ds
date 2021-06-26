module.exports = (sequelize, Sequelize) => {
    const creditDetail = sequelize.define('creditDetails', {
        month: {
            type: Sequelize.INTEGER
        },
        priceInterest: {
            type: Sequelize.DECIMAL
        },
        pricePrincipal: {
            type: Sequelize.DECIMAL
        },
        totalprice: {
            type: Sequelize.DECIMAL
        },
        status: {
            type: Sequelize.ENUM('paid', 'unpaid'),
            defaultValue: 'unpaid'
        }
    })

    return creditDetail
}