const sequelize = require("../database/connections");
const { INTEGER } = require("sequelize");
const Sequelize = require("sequelize");

const TemporaryNotice = sequelize.define("temporary_notices", {
     id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    customerName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
      driverName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    drivingLicenceNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
     typeOfVehicle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
     plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
     cartPlateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
     policyNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
     typeOfAccident: {
        type: Sequelize.STRING,
        allowNull: false,
    },
     typeOfAccident: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    accidentDate: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    placeOfAccident: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    accidentDescription: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reportedBy: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    relationWithTheReporter: {
        type: Sequelize.STRING,
        allowNull: true,
    },
     policeOfficerName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    addressOfTheReport: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    resonForUsingFillingThisForm: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    responseToTheCustomer: {
        type: Sequelize.STRING,
        allowNull: false,
    },
      dateOfRegistration: {
        type: Sequelize.DATE,
        allowNull: false,
    },



});
module.exports = TemporaryNotice;