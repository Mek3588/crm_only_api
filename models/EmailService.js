const { DOUBLE, STRING, NUMBER, ARRAY, DataTypes } = require("sequelize");
const { INTEGER } = require("sequelize");
const {Contact} = require("./Contact");
const sequelize = require("../database/connections");

const EmailService = sequelize.define("email_services", {
    id: {
        type: INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
    },
    senderName: {
        type: INTEGER,
    },
    senderAddress: {
        type: STRING,
    },
    subject: {
        type: STRING,
    },
    message: {
        type: STRING,
    },
    misc: {
        type: STRING,
    },
   
    
})

module.exports = EmailService;