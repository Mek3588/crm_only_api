
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const ShareholderContact = sequelize.define("shareholder_contacts", {
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
    shareholderId: {
        type: INTEGER,
        allowNull: false,
    }

});

module.exports =  ShareholderContact