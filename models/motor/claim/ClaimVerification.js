const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const ClaimNotification = require('../claim/ClaimNotification')
const Customer = require('../../customer/Customer')

const ClaimVerification = sequelize.define('claimVerifications', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: INTEGER,
        allowNull: false
    },
    insuredName:{
        type:STRING
    },
    policyNumber: {
        type: STRING,
        allowNull: false
    },
    plateNumber: {
        type: STRING,
    
    },
    accidentDate: {
        type: STRING,
    },
    accidentType: {
        type: STRING,
    },
    claimNumber: {
        type: STRING,
    },
    vehicle_type: {
        type: STRING,
    },
    rvNumber: {
        type: STRING,
    },
    collisionedVehicleOwner: {
        type: STRING,
    },
    collisionedVehiclePlateNumber: {
        type: STRING,
    },
    verificationStatus: {
        type: STRING,
        default:"PENDING"
    }
    });

// ClaimVerification.sync({force: true})

ClaimVerification.belongsTo(ClaimNotification, {foreignKey: 'claimNumber'})
    
module.exports = ClaimVerification;