const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Contact = require("./Contact");

const SharedSales = sequelize.define("shared_sales", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    contactId: {
        type: INTEGER
    },
    userId: {
        type: INTEGER
    }
})
User.hasMany(SharedSales)
SharedSales.belongsTo(User)

Contact.hasMany(SharedSales)
SharedSales.belongsTo(Contact)

module.exports = SharedSales