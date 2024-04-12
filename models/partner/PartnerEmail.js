const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const PartnerEmails = sequelize.define("partner_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    partnerId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = PartnerEmails;