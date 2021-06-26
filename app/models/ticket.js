module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define('tickets', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        status: {
            type: Sequelize.ENUM('new', 'used'),
            defaultValue: 'new'
        }
    })

    return Ticket
}