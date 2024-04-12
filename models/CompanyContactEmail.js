const sequelize = require("../database/connections");
const {INTEGER} = require("sequelize");

const CompanyContactEmails = sequelize.define("companyContact_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    companyContactId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
})

module.exports = CompanyContactEmails;
