const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const CompetitorEmails = sequelize.define("competitor_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    competitorId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
});

module.exports = CompetitorEmails;