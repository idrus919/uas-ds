module.exports = (sequelize, Sequelize) => {
    const Credit = sequelize.define('credits', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        totalMonth: {
            type: Sequelize.INTEGER
        },
        interest: {
            type: Sequelize.DECIMAL
        },
        totalCredit: {
            type: Sequelize.DECIMAL
        },
    })

    return Credit
}