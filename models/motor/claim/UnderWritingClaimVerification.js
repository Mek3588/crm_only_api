const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const ClaimVerification = require('./ClaimVerification')

const UnderWritingClaimVerification = sequelize.define('underWritingClaimVerifications', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    claimVerificationId: {
        type: INTEGER,
        allowNull: false
    },
    customerId: {
        type: INTEGER,
        allowNull: false
    },
    accountNumber: {
        type: STRING,
        allowNull: false
    },
    plateNumber: {
        type: STRING,
    },
    accidentType: {
        type: STRING,
    },
    accidentDate: {
        type: DATE,
    },
    model: {
        type: STRING,
    },
    chassisNumber: {
        type: STRING,
    },
    engineNumber: {
        type: STRING,
    },
    yearOfManufacture: {
        type: STRING,
    },
    policyNumber: {
        type: STRING,
    },
    purpose: {
        type: STRING,
    },
    vehicleType: {
        type: STRING,
    },
    coverType: {
        type: STRING,
    },
    policyStartDate: {
        type: STRING,
    },
    policyEndDate: {
        type: STRING,
    },
    sumInsured: {
        type: STRING,
    },
    premium: {
        type: DOUBLE,
    },
    compulsoryExcess: {
        type: DOUBLE,
    },
    accidentType:{
        type:STRING
    },
    voluntaryExcess: {
        type: DOUBLE,
    },
    youngAndInexperiencedDriverExcess: {
        type: DOUBLE,
    },
    thirdPartyLimitForDeath: {
        type: DOUBLE,
    },
    thirdPartyLimitForBodilyInjury: {
        type: DOUBLE,
    },

    thirdpartyLimitForMedicalExpenses: {
        type: DOUBLE,
    },
    thirdPartyLimitForPropertyDamage: {
        type: DOUBLE,
    },
    thirdPartyLimitForEvent: {
        type: DOUBLE,
    },
    addons: {
        type: STRING,
    },
    bankInterest: {
        type: DOUBLE,
    },
    previousClaimRecord: {
        type: STRING,
    },
    preRiskSurvey: {
        type: STRING,
    },
    outstandingPremium: {
        type: DOUBLE,
    },
    additionalRemarks: {
        type: STRING,
    },
    });

module.exports = UnderWritingClaimVerification;
