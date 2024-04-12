
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Contact = require("./Contact");

const User = require("./acl/user");

const ContactBranch = sequelize.define("contact_branchs", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    branchId: {
         type: INTEGER,
        allowNull: false,
    },
    contactId: {
          type: INTEGER,
        allowNull: false,
    }
})
module.exports = ContactBranch

