const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN } = require('sequelize')
const Customer = require('../../customer/Customer')
const Policy = require('../../Policy')
const Contact = require('../../Contact')

const ClaimNotification = sequelize.define('claimNotifications', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: INTEGER,

    },
    claimNo: {
        type: STRING,
        
    },
    policyNumber: {
        type: STRING,
    },
    driverFullName:{
        type:STRING
    },
    firstPlateNumber: {
        type: STRING,
    },
    driverFirstName: {
        type: STRING,
    },
    driverMiddleName: {
        type: STRING,
    },
    driverLastName: {
        type: STRING,
    },
    driverCity: {
        type: STRING,
    },
    driverSubcity: {
        type: STRING,
    },
    driverRegion: {
        type: STRING,
    },
    driverKebele: {
        type: STRING,
    },
    driverHouseNo: {
        type: STRING,
    },
    driverPhoneNo: {
        type: STRING,
    },

    driverLicense: {
        type: STRING,
    },
    driverLicenseNo:{
        type:STRING
    },
    
    driverLicenseGrade: {
        type: STRING,
    },

    driverLicenseExpiryDate: {
        type: STRING,
    },
    policyHolderFullName:{
        type:STRING
    },
    policyHolderProfession: {
        type: STRING,
    },
    policyHolderHouseNo: {
        type: INTEGER,
    },
    policyHolderRegion:{
        type:STRING
    },
    policyHolderCity:{
        type:STRING
    },
    policyHolderSubcity:{
        type:STRING
    },
    policyHolderKebele:{
        type:STRING
    },
    accidentDate: {
        type: STRING,
    },
    accidentTime: {
        type: STRING,
    },
    accidentPlace: {
        type: STRING,
    },
    accidentType: {
        type: STRING,
    },
    secondPersonName: {
        type: STRING,
    },
    secondPlateNumber: {
        type: STRING,
    },
    cargoType: {
        type: STRING,
    },
    cargoQuantity: {
        type: STRING,
    },
    crainType: {
        type: STRING,
    },
    isPoliceTakeParticular: {
        type: BOOLEAN,
    },
    policeStationName: {
        type: STRING,
    },
    policeName: {
        type: STRING,
    },
    accidentDescription: {
        type: STRING,
    },
    cargoDamageExtent: {
        type: STRING,
    },
    claimNotificationDate: {
        type: STRING,
    },
    notificationPath: {
        type: STRING,
    }
});

//ClaimNotification.sync({force:true})    
ClaimNotification.belongsTo(Customer, {foriegnKey: "customerId", as: "Customer"  })
//ClaimNotification.hasMany(Policy, {foriegnKey: "customerId", as: "Customer"  })

module.exports = ClaimNotification