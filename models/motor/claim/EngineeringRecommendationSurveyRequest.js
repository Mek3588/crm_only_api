const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const ClaimNotification = require('../claim/ClaimNotification')

const EngineeringRecommendationSurveyRequest = sequelize.define('engineeringRecommendationSurveyRequests', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: INTEGER,
        allowNull: false,
    },
    claimNumber: {
        type: STRING,
        allowNull: false
    },
    plateNumber: {
        type: STRING,
        allowNull: false
    },
    vehicleType: {
        type: STRING,
        allowNull: false
    },
    yearOfManufacture: {
        type: STRING,
        allowNull: false
    },
    chassisNumber: {
        type: STRING,
        allowNull: false
    },
    accidentType: {
        type: STRING,
        allowNull: false
    },
    placeOfSurvey: {
        type: STRING,
        allowNull: false
    },
    surveyType: {
        type: STRING,
        allowNull: false
    },
    requestDate: {
        type: DATE,
        allowNull: false
    }, 

    }
);

EngineeringRecommendationSurveyRequest.belongsTo(ClaimNotification, {foreignKey: 'claimNumber'})
module.exports = EngineeringRecommendationSurveyRequest;