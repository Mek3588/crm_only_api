
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");


const ContactEmployee = sequelize.define("contact_employees", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    employeeId: {
        type: INTEGER,
    },
    contactId: {
        type: INTEGER,
    }
})
module.exports = ContactEmployee

