const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN } = require('sequelize')
const ClaimNotification = require('../claim/ClaimNotification')
const Bidder = require('./Bidder')


const TenderAnalysis = sequelize.define('tenderAnalysis', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    claimNo: {
        type: STRING,
    },  
    plateNo: {
        type: STRING,
    },
    policyNo: {
        type: STRING,
    },
    quotationId: {
        type: INTEGER,
    },
    bidderId: {
        type: INTEGER,
    },
    bidAmount: {
        type: DOUBLE,
    },
    bidDate: {
        type: DATE,
    },
    createdAt: {
        type: DATE,
    },
    updatedAt: {
        type: DATE,
    },

    })

    TenderAnalysis.belongsTo(ClaimNotification, {foreignKey: 'claimNo'})
    TenderAnalysis.belongsTo(Bidder, {foreignKey: 'bidderId'})

module.exports = TenderAnalysis;
    
