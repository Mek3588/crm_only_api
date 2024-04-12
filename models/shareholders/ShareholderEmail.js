const sequelize = require("../../database/connections");
const {INTEGER} = require("sequelize");

const ShareholderEmails = sequelize.define("shareholder_emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    shareholderId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
})
// ShareholderEmails.sync({ alter:  true });
module.exports = ShareholderEmails;

