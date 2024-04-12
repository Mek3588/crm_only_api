
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const CompetitorContact = sequelize.define("competitor_contacts", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    companyContactId: {
        type: INTEGER,
        allowNull: false,
    },
    competitorId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  CompetitorContact