const sequelize = require("../../../database/connections")
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN, NUMBER } = require('sequelize')
const ClaimNotification = require("./ClaimNotification")
const InjuredPeople = require("./InjuredPeople")


const PoliceReport = sequelize.define('policeReports', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    claimNumber: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    plateNumber: {
        type: STRING,
        allowNull: false
    },
    accidentDate: {
        type: DATE,
        allowNull: false
    },
    accidentTime: {
        type: STRING,
        allowNull: false
    },
    accidentRegion: {
        type: STRING,
        allowNull: false
    },
    accidentCity: {
        type: STRING,
        allowNull: false
    },
    accidentKebele: {
        type: STRING,
        allowNull: false
    },
    accidentSpecificLocation: {
        type: STRING,
        allowNull: false
    },
    accidentType: {
        type: STRING,
        allowNull: false
    },
    accidentCause: {
        type: STRING,
        allowNull: false
    },
    accidentDescription: {
        type: STRING,
        allowNull: false
    },
    driverFirstName: {
        type: STRING,
        allowNull: false
    },
    driverMiddleName: {
        type: STRING,
        allowNull: false
    },
    driverLastName: {
        type: STRING,
        allowNull: false
    },
    driverLicenseNumber: {
        type: STRING,
        allowNull: false
    },
    driverLicenseType: {
        type: STRING,
        allowNull: false
    },
    isAccidentInvolveOtherVehicle: {
        type: BOOLEAN,
    },
    plateNumberOfOtherVehicle: {
        type: STRING,
    },
    driverFirstNameOfOtherVehicle: {
        type: STRING,
    },
    driverMiddleNameOfOtherVehicle: {
        type: STRING,
    },
    insuranceCompanyOfOtherVehicle: {
        type: STRING,
    },
    branchNameOfInsuranceCompanyOfOtherVehicle: {
        type: STRING,
    },
    driverOfOtherVehicleRegion: {
        type: STRING,
    },
    driverOfOtherVehicleCity: {
        type: STRING,
    },
    driverOfOtherVehicleKebele: {
        type: STRING,
    },
    driverOfOtherVehicleHouseNumber: {
        type: STRING,
    },
    driverOfOtherVehiclePhoneNumber: {
        type: STRING,
    },
    driverOfOtherVehicleLicenseNumber: {
        type: STRING,
    },
    driverOfOtherVehicleLicenseType: {
        type: STRING,
    },
    driverOfOtherVehicleLicenseRenewalDate: {
        type: DATE,
    },
    driverOfOtherVehicleLicenseIssueDate: {
        type: DATE,
    },
    ownerFirstNameOfOtherVehicle: {
        type: STRING,
    },
    ownerMiddleNameOfOtherVehicle: {
        type: STRING,
    },
    ownerRegionOfOtherVehicle: {
        type: STRING,
    },
    ownerOfOtherVehicleKebele: {
        type: STRING,
    },
    ownerOfOtherVehicleHouseNumber: {
        type: STRING,
    },

    ownerOfOtherVehiclePhoneNumber: {
        type: STRING,
    },
    policeReportDocument: {
        type: STRING,
    },
    isInjuredPeople: {
        type: BOOLEAN,
    },
    isInjuredAnimal: {
        type: BOOLEAN,
    },
    vehicleDamageDescription: {
        type: STRING,
        allowNull: false
    },
    numberOfPeopleDuringAccident: {
        type: INTEGER
    },
    vehicleCargoAmountDuringAccident: {
        type: DOUBLE,
        allowNull: false
    },
    damageDescription: {
        type: STRING,
        allowNull: false
    },


    });

//PoliceReport.sync({ force: true })
PoliceReport.belongsTo(ClaimNotification, {foreignKey: 'claimNumber', targetKey: 'claimNo'})
PoliceReport.hasMany(InjuredPeople)

module.exports = PoliceReport;