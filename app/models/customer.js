module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define('customers', {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    })

    return Customer
}