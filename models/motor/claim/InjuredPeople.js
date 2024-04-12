const sequelize = require("../../../database/connections");
const { INTEGER, STRING, DOUBLE, DATE , BOOLEAN} = require("sequelize");
const PoliceReport = require("./PoliceReport");

const InjuredPeople = sequelize.define("injured_people", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    injuredPersonFirstName: {
        type: STRING,
    },
    injuredPersonMiddleName: {
        type: STRING,
    },
    injuredPersonIdentity: {
        type: STRING,
    },
    injuredPersonAddress: {
        type: STRING,
    },
    injuredPersonInjuryType: {
        type: STRING,
    },
    injuredAnimalOwnerFirstName: {
        type: STRING,
    },
    injuredAnimalOwnerMiddleName: {
        type: STRING,
    },
    injuredAnimalType: {
        type: STRING,
    },
    injuredAnimalOwnerAddress: {
        type: STRING,
    },
    injuredAnimalAmount: {
        type: INTEGER,
    },
    injuredAnimalEstimatedValue: {
        type: DOUBLE,
    },
    policeReportId: {
        type: INTEGER,
    },

});

module.exports = InjuredPeople;
    