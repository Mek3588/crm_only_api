const { DOUBLE, STRING, NUMBER, ARRAY, DataTypes } = require("sequelize");
const { INTEGER } = require("sequelize");
const {Contact} = require("./Contact");
const sequelize = require("../database/connections");
const EmailService = require("./EmailService");

const EmailContact = sequelize.define("email_contact", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
})

Contact.belongsToMany(EmailService, { through: 'EmailContact' })
EmailService.belongsToMany(Contact, { through: 'EmailContact' })

modeule.export(EmailContact)