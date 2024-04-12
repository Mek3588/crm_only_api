const sequelize = require("../database/connections");
const { INTEGER } = require("sequelize");
const Sequelize = require("sequelize");
const { BOOLEAN } = require("sequelize");
const Notification = sequelize.define("notifications", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    contactId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    driver:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    registerdVAT:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    dateOfAccident:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    speedOfVehicle:{
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    distanceFromTheSide:{
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    hornSound:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    wasInTheVehicleDuringtheAccicdent:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    accidentDescription:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    involvedDriverName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    involvedDriverAddress:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    responsbleForTheAccident:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    previousAccident:{
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    involvedDriverInsuranceCompany:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    policeStationName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    policeName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    policeIdentificationNumber:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    otherPassangers:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    otherPassangersAdress:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    witnessName:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    witnessAdress:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    resonForNotTakingWitnessInfo:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    detailsOfDamage:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    detailsOfDamageOnThirdParty:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    injuredPersonName:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    injuredPersonAdress:{
         type: Sequelize.STRING,
        allowNull: true,
    },
    injureyType:{
         type: Sequelize.STRING,
        allowNull: true,
    }




})

module.exports = Notification