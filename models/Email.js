const { DOUBLE, STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Contact = require("./Contact");

const PhoneNo = sequelize.define("emails", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    ownerId: {
        type: INTEGER,
        allowNull: false,
    },
    type: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
    category: {
        type: STRING,
        allowNull: false,
    }
})


PhoneNo.belongsTo(Contact, { foreignKey: "ownerId", as: "owner" })
Contact.hasOne(PhoneNo, { foreignKey: "ownerId", as: "owner" })
module.exports = PhoneNo;
