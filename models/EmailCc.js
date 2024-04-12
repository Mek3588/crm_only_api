const { DOUBLE, STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const EmailModel = require("./EmailModel");

const Emailcc = sequelize.define("emailccs", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: STRING,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    }
   
})
Emailcc.belongsTo(EmailModel)
EmailModel.hasMany(Emailcc)
module.exports = Emailcc;