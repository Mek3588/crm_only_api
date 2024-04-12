
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const PartnerContact = sequelize.define("partner_contacts", {
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
    partnerId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  PartnerContact