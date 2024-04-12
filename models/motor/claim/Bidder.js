const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN } = require('sequelize')
const ClaimNotification = require('../claim/ClaimNotification')

const Bidder = sequelize.define('bidders', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    claimNo: {
        type: STRING,
    },

    bidId: {
        type: INTEGER
    },

    name: {
        type: STRING,
    },
    email: {
        type: STRING,
    },
    phone: {
        type: STRING,
    },
    address: {
        type: STRING,
    },
    city: {
        type: STRING,
    },
    state: {
        type: STRING,
    },
    createdAt: {
        type: DATE,
    },
    updatedAt: {
        type: DATE,
    },

})

Bidder.belongsTo(ClaimNotification, {foreignKey: 'claimNo',as:"ClaimNotifications"})

module.exports = Bidder;